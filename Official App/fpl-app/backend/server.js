const express = require('express');
const cors = require('cors');
const axios = require('axios');

/*
import express from 'express';
import cors from "cors";
import axios from "axios";
*/

const server = express();
server.use(cors()); // Enable CORS

const API_URL = "https://fantasy.premierleague.com/api/leagues-classic/697909/standings/"; // 697909 for the specific league

//Proxy endpoint

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

//Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));