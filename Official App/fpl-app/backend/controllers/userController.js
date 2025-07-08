const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv').config();

const User = require('../models/User');
const DuplicateUser = require('../models/DuplicateUser');

const saltRounds = 10;
const secret_key = process.env.SECRET_KEY;

const league_code = process.env.FPL_LEAGUE_CODE;
const FPL_LEAGUE_URL = `https://fantasy.premierleague.com/api/leagues-classic/${league_code}/standings`;

/* 1. GET USERS OF THE LEAGUE AND THEIR LEAGUE DATA */
exports.getLeagueData = async (req, res) => {
    try {
        const response = await axios.get(FPL_LEAGUE_URL);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: `Error fetching league data from the API: ${err}` });
    }
}

/* 2. GET REGISTERED USERS */
exports.getRegisteredUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: `Failed to fetch users: ${err}` });
    }
}

/* 3. REGISTER USER */
// Point to note: use fpl_id in the future not playername since the username can now be changed
exports.registerUser = async (req, res) => {
    const { playerName, email, phoneNumber, password } = req.body;

    try {
        const fplResponse = await axios.get(FPL_LEAGUE_URL);
        const fplStandings = fplResponse?.data?.standings?.results || [];

        const matchingPlayer = fplStandings.find(
            player => player.player_name.toLowerCase() === playerName.toLowerCase()
        )

        if (!matchingPlayer) {
            return res.status(404).json({ message: "Player name not found in league" });
        }

        const fpl_id = matchingPlayer.entry;

        const alreadyRegistered = await User.findOne({ fpl_id });

        if (alreadyRegistered) {
            return res.status(400).json({ message: "FPL Account already registered" });
        }

        const existingUser = await User.findOne({
            $or: [ {email}, {playerName} ]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email or team name already registered" });
        }

        const hashedPassword = await bcrypt.hash( password, saltRounds );

        const newUser = new User({
            fpl_id,
            userName: playerName,
            playerName,
            email,
            phoneNumber,
            password: hashedPassword
        });
        
        await newUser.save();

        const newDuplicateUser = new DuplicateUser({
            fpl_id,
            userName: playerName,
            playerName,
            teamName: matchingPlayer.entry_name,
            email,
            phoneNumber,
            balance: 0,
            moneyEarned: 0
        });

        await newDuplicateUser.save();

        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: `Internal server error ${err}` })
    }
}

/* 4. LOGIN ENDPOINT */
exports.loginUser = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(401).json({ message: "Username not found" });
        }

        const passwordMatch = await bcrypt.compare( password, user.password );

        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect username/password" });
        }

        /*  ASSIGN TOKEN ON SUCCESSFUL LOGIN */
        const token = jwt.sign(
            { 
                fpl_id: user.fpl_id,
                role: user.role
            }, // PAYLOAD
            secret_key, // SIGNATURE
            { expiresIn: "1h" }
        )

        const decodedToken = jwt.verify( token, secret_key );

        res.status(200).json({
            message: "Login successful",
            token: token, /* token contains fpl_id, iat & exp */
            decodedToken: decodedToken
        })
    } catch (err) {
        res.status(500).json({ message: `Internal server error! ${err}` });
    }
}

/* 5. GET SPECIFIC USER DETAILS */
/* (requires token) */
exports.getUserDetails = async (req, res) => {
    try {
        const fpl_id = req.user.fpl_id;
        
        const user = await DuplicateUser.findOne({ fpl_id });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User found",
            user // returns user object
        });
    } catch (err) {
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
}

/* 6. CHANGE PHONE NUMBER */
/* (requires token) */
exports.changePhoneNumber = async (req, res) => {
    const { newPhoneNumber } = req.body;
    const fpl_id = req.user.fpl_id;

    if ( !fpl_id || !newPhoneNumber ) {
        return res.status(400).json({ message: "Missing player name or new phone number" });
    }

    try {
        const user = await DuplicateUser.findOne({ fpl_id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if ( newPhoneNumber === user.phoneNumber) {
            return res.status(409).json({ message: "Phone number cannot be the same" })
        }

        user.phoneNumber = newPhoneNumber;
        await user.save();

        res.status(200).json({ message: `Phone number updated successfully to ${user.phoneNumber}` });
    } catch (err) {
        res.status(500).json({ message: `Error updating phone number: ${err}` });
    }
}

/* 7. CHANGE PASSWORD */
/* (requires token) */
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const fpl_id = req.user.fpl_id;

    if ( !fpl_id || !newPassword || !currentPassword ) {
        return res.status(400).json({ message: "All fields are required" });
    } 

    try {
        const foundUser = await User.findOne({ fpl_id });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isCurrentPassword = await bcrypt.compare( currentPassword, foundUser.password );

        if (!isCurrentPassword) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        const isSamePassword = await bcrypt.compare( newPassword, foundUser.password );
        if (isSamePassword) {
            return res.status(400).json({ message: "New Password cannot be the same as current password" });
        }

        const hashedNewPassword = await bcrypt.hash( newPassword, saltRounds );
        foundUser.password = hashedNewPassword;
        await foundUser.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: `Internal server error: ${err}` });
    }
}

/* 8. CHANGE USERNAME */
/* (requires token) */
exports.changeUsername = async (req, res) => {
    const { newUsername } = req.body;
    const fpl_id = req.user.fpl_id;

    if ( !fpl_id || !newUsername ) {
        return res.status(400).json({ message: "Missing data" });
    };

    try {
        const foundUser = await User.findOne({ fpl_id });
        const user = await DuplicateUser.findOne({ fpl_id });

        if ( !foundUser || !user ) {
            return res.status(404).json({ message: "User not found" });
        };

        if ( newUsername === foundUser.userName || newUsername === user.userName ) {
            return res.status(401).json({ message: "New username must be different from the current one" })
        };

        foundUser.userName = newUsername;
        await foundUser.save();

        user.userName = newUsername;
        await user.save();

        return res.status(200).json({ message: "Username updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error"});
    }
}
