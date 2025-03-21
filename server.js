const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS (allows frontend to fetch data from backend)
app.use(cors());

// API Route to Fetch FPL Data
app.get("/api/fpl", async (req, res) => {
    try {
        const response = await axios.get("https://fantasy.premierleague.com/api/entry/910504/");
        res.json(response.data); // Send only player data
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch FPL data" });
    }
});

// Serve static files (Frontend)
app.use(express.static("public"));

// Handle unknown routes (redirect to index.html)
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
