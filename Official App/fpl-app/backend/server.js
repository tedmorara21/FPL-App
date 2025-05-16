const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

/*
import express from 'express';
import cors from "cors";
import axios from "axios";
*/

const server = express();
server.use(cors()); // ENABLE CORS
server.use(express.json());  //TO PARSE JSON REQUEST BODY   

const API_URL = "https://fantasy.premierleague.com/api/leagues-classic/697909/standings/"; // 697909 for the specific league

//PROXY ENDPOINT

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

const User = mongoose.model('Login Details', UserSchema);

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

      const newUser = new User({ playerName, email, phoneNumber, password});
      await newUser.save();

      res.status(201).json({ message: "User registered successfully"})
   } catch ( error ){
      console.error("Error saving user:", error)
      res.status(500).json({ error: "Internal server error" });
   }
})

//Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));