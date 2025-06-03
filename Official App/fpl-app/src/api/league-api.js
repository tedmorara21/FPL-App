import axios from "axios";

const API_URL = "https://fpl-proxy-server.onrender.com/api/league"; //local proxy


export const getLeagueStandings = async () => {
   try {
      const response = await axios.get(API_URL);

      // console.log("Full API Response: ", response);
      // console.log("API Data: ", response.data);

      // Ensure API response has data before accessing
      if (response.data && response.data.standings && response.data.standings.results) {
         return response.data.standings.results; // Return users array
      } else {
         console.error("Unexpected API response structure:", response.data);
         return []; // Return empty array if data is missing
      }
   } catch (error) {
      console.error("Error fetching league standings by Guzuuu" , error);
      return []; // Return empty array on error
   }
}