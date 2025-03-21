const axios = require('axios');

const FPL_API_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";

async function fetchFPLData() {
   try {
      const response = await fetch(FPL_API_URL);
      const data = await response.json();
      return data.elements;
   } catch (error) {
       console.error("Error fetching FPL data:", error.message);
       return null;
   }
}

/*
async function displayTopPlayers() {
   const players = await fetchFPLData();
   const tableBody = document.getElementById("playerTable");
   const positionNames = {1: "Goalkeeper", 2: "Defender", 3: "Midfielder", 4: "Forward"};

   players.slice(0, 10).forEach(player => {
       let row = document.createElement("tr");
       row.innerHTML = `
           <td>${player.first_name} ${player.second_name}</td>
           <td>${positionNames[player.element_type] || "Unknown"}</td>
           <td>${player.total_points}</td>
       `;
       tableBody.appendChild(row);
   });
}

displayTopPlayers();
*/

async function displayData() {
   const players = await fetchFPLData();
   console.log(players);
}

displayData();