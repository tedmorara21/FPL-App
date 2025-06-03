const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const jwt_decode = require("json-decode");
const secret_key = 'tedmorara21'; 

/*
import express from 'express';
import cors from "cors";
import axios from "axios";
*/

const server = express();
server.use(cors()); // ENABLE CORS
server.use(express.json());  //TO PARSE JSON REQUEST BODY   

//PROXY ENDPOINT

const API_URL = "https://fantasy.premierleague.com/api/leagues-classic/697909/standings/"; // 697909 for the specific league

//GET USERS OF THE LEAGUE AND THEIR DATA
server.get("/api/league", async ( req, res) => {
   try {
      const response = await axios.get(API_URL, {
         headers: { "User-Agent": "Mozilla/5.0" }, // Some APIs require a User-Agent
       });

      // console.log("Backend API Response:", response.data); // Debugging

      res.json(response.data); //Forward the response
   } catch (error) {
      console.error("Error fetching data: by Guzuuu", error.message);
      res.status(500).json({ error: "Error fetching data from the API" });
   }
});

mongoose.connect('mongodb+srv://tedmorara21:Whooshwhoosh.99@cluster0.jkn4gii.mongodb.net/',{
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then( ()=> console.log('MongoDB connected') )
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

const User = mongoose.model('Login Details', UserSchema);
const DuplicateUser = mongoose.model("User Details", duplicateUserSchema, "UserDetails");

// GET USERS
server.get("/api/users", async ( req, res ) => {
   try {
      const users = await User.find();
      res.status(200).json(users);
   } catch (error) {
      console.error("Error fetching users by Guzuuu", error);
      res.status(500).json( {
         error: "Failed to fetch users"
      } );
   }
})

//ADD NEW USERS
server.post("/api/users", async (req, res) => {
   const { playerName, email, phoneNumber, password } = req.body;

   try {
      const existingUser = await User.findOne({
          $or: [ { email }, { playerName } ]
      });
      
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

      const fplResponse = await axios.get(API_URL, {
         headers: { "User-Agent": "Mozilla/5.0" }
      });

      let standings;

      if (!fplResponse.data.standings) {
         standings = [];
      } else {
         standings = fplResponse.data.standings.results;
      }

      const matchingPlayer = standings.find( player => player.player_name.toLowerCase() === playerName.toLowerCase() );
      
      if (!matchingPlayer) {
         return res.json(404).json( { error: "Player name not found in league!" } );
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
   } catch ( error ){
      console.error("Error saving user:", error)
      res.status(500).json({ error: "Internal server error" });
   }
})

//LOGIN ENDPOINT
server.post("/api/login", async ( req, res ) => {
   const { playerName, password } = req.body;

   try {
      const player = await User.findOne( { playerName });

      if (!player) {
         return res.status(401).json( { message: "Team name not found by Guzuuu" } );
      }

      const passwordMatch = await bcrypt.compare( password, player.password );

      if (!passwordMatch) {
         return res.status(401).json( {message: "Incorrect username/password"} );
      };

      //optional: return a token or user data
      const token = jwt.sign(
         { id: player.playerName }, //PAYLOAD
         secret_key,
         { expiresIn: "1h" }
      )
      //console.loG(token);

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

   } catch ( error ) {
      console.error("Login error: ", error)
      res.status(500).json( { message: "Internal Server error!" } );
   }
})





//Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));