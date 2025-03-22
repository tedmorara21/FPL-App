import axios from "axios";

const API_URL = "https://fantasy.premierleague.com/api/leagues-classic/697909/standings/";

//Function to get users
export const getLeagueStandings = async () => {
   try {
      const response = await axios.get(API_URL);

      //Get users from the API response
      const users = response.data.standings.results;

      return users; //Return users array
   } catch (error) {
      console.error("Error fetching league standings by Guzuuu" , error);
      return []; //return empty array on error
   }
}