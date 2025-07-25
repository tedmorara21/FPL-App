import axios from "axios";

const API_URL = "https://fpl-proxy-server.onrender.com/api/league"; 


export const getLeagueStandings = async () => {
   try {
      const response = await axios.get(API_URL);
      
      /* ENSURE API RESPONSE BEFORE ACCESSING */
      if (response.data && response.data.standings && response.data.standings.results) {
         return response.data.standings.results; /* RETURN USERS ARRAY */
      } else {
         return [];
      }
   } catch (err) {
      console.error("Error fetching league standings by Guzuuu:" , err);
      return []; 
   }
}
