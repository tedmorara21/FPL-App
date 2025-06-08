const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const jwt_decode = require("jwt-decode");
const secret_key = 'tedmorara21'; 

/*
import express from 'express';
import cors from "cors";
import axios from "axios";
*/

const server = express();
server.use(cors()); // ENABLE CORS
server.use(express.json());  //TO PARSE JSON REQUEST BODY   

//PROXY ENDPOINTS

/*
---.get("/api/league")
---mongoose.connect = schemas = classes
---.get("api/users")
---.post("/api/login")
---authenticateToken()
---.get("/api/get-user-details")
*/

const API_URL = "https://fantasy.premierleague.com/api/leagues-classic/697909/standings/"; // 697909 for the specific league

//GET USERS OF THE LEAGUE AND THEIR DATA
server.get("/api/league", async ( req, res) => {
   try {
      const response = await axios.get(API_URL);
      res.json(response.data); 
   } catch (err) {
      res.status(500).json({ error: `Error fetching data from the API ${err}`});
   }
});

mongoose.connect('mongodb+srv://tedmorara21:Whooshwhoosh.99@cluster0.jkn4gii.mongodb.net/database1')
   .then( ()=> console.log('MongoDB connected') )
   .catch( err => console.error("MongoDB connection error", err) );


//SCHEMA TO BE USED
const UserSchema = new mongoose.Schema({
  playerName: String,
  email: String,
  phoneNumber: String,
  password: String
});

const duplicateUserSchema = new mongoose.Schema( {
   id: Number,
   playerName: String,
   teamName: String,
   email: String,
   phoneNumber: String,
   password: String,
   balance: Number,
   moneyEarned: Number
} )

const User = mongoose.model('Login Details', UserSchema, 'login details');
const DuplicateUser = mongoose.model("User Details", duplicateUserSchema, "User Details");

// GET USERS
server.get("/api/users", async ( req, res ) => {
   try {
      const users = await User.find();
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
   }
})

//ADD NEW USERS
server.post("/api/users", async (req, res) => {
   const playerName = req.body.playerName;
   const email = req.body.email;
   const phoneNumber = req.body.phoneNumber;
   const password = req.body.password;
   // const { playerName, email, phoneNumber, password } = req.body;

   try {
      const existingUser = await User.findOne({
          $or: 
          [ 
            { email }, { playerName } 
         ]
      });
      // const existingUser = wait User.findOne({$or: [ {email} {playerName} ]});
      
      if (existingUser) {
         return res.status(400).json( { error: "Team name or email already registered" } )
      }

      const hashedPassword = await bcrypt.hash( password, saltRounds );

      const newUser = new User({ 
         playerName, 
         email, 
         phoneNumber, 
         password: hashedPassword
      });

      await newUser.save();

      const fplResponse = await axios.get(API_URL);

      let fplStandings;

      if (!fplResponse.data.standings) {
         fplStandings = [];
      } else {
         fplStandings = fplResponse.data.standings.results;
      }

      // CHECK FOR A MATCHING PLAYER AND RETURN THE MATCHING PLAYER DETAILS
      const matchingPlayer = fplStandings.find( player => player.player_name.toLowerCase() === playerName.toLowerCase() );
      if (!matchingPlayer) {
         return res.json(404).json({ error: "Player name not found in league!" });
      };

      const duplicateUser = new DuplicateUser ( {
         id: matchingPlayer.entry,
         playerName,
         teamName: matchingPlayer.entry_name,
         email,
         phoneNumber,
         balance: 0,
         moneyEarned: 0
      });

      await duplicateUser.save();
      // console.log ("Duplicted user data: ", duplicateUser);

      res.status(201).json({ message: "User registered successfully"});
   } catch (err){
      res.status(500).json({ error: `Internal server error, ${err}` });
   }
})

//LOGIN ENDPOINT
server.post("/api/login", async ( req, res ) => {
   const playerName = req.body.playerName;
   const password = req.body.password;

   // const { playerName, password } = req.body;

   try {
      const player = await User.findOne( { playerName: playerName });

      if (!player) {
         return res.status(401).json( { message: "Team name not found by Guzuuu" } );
      }

      const passwordMatch = await bcrypt.compare( password, player.password );

      if (!passwordMatch) {
         return res.status(401).json( {message: "Incorrect username/password"} );
      };

      // RETURN  TOKEN OR USER DATA
      const token = jwt.sign(
         { id: player.playerName }, //PAYLOAD
         secret_key, // SIGNATURE
         { expiresIn: "1h" }
      )
      //console.log(token);

      const decodedToken = jwt.verify(token, secret_key);
      //console.log("Decoded Token: ", decodedToken);

      res.status(200).json( {
         message: "Login successful",
         user: {
            playerName: player.playerName,
            email: player.email,
            phoneNumber: player.phoneNumber
            //NEVER SEND THE PASSWORD HASH
         },
         token: token,
         decodedToken, decodedToken
      } );

   } catch (err) {
      res.status(500).json( { message: `Internal Server error! ${err}` } );
   }
})


// MIDDLEWARE TO VERIFY TOKENS
function authenticateToken (req, res, next) {
   const authHeader = req.headers['authorization']; 

   if (!authHeader) {
      return res.status(401).json({ message: "No token provided "});
   }

   const token = authHeader.split(' ')[1];

   if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
   }

   try {
      const decodedToken = jwt.verify(token, secret_key);
      req.user = decodedToken;
      next();
   } catch (err) {
      return res.stautus(401).json({ message: `Invalid/expired token ${err}` })
   }
}

server.get("/api/get-user-details", authenticateToken, async (req, res) => {
   try {
      const playerName = req.user.id;
      
      const user = await DuplicateUser.findOne( {playerName} );

      if (!user) {
         return res.status(404).json( {message: "User not found"} );
      }

      res.status(200).json( { 
         message: "User not found",
         user // returns user object
       });
   } catch (err) {
      res.status(500).json( { message: `Internal server error ${err}` } );
   }
} )

//Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));