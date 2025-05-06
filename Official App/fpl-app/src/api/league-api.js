import axios from "axios";

const API_URL = "http://192.168.100.3:5001/api/league"; //local proxy

//Function to get users
export const getLeagueStandings = async () => {
   try {
      // console.log("Fetching data from:", API_URL);
      const response = await axios.get(API_URL);

      console.log("Full API Response: ", response);
      console.log("API Data: ", response.data);

      //Get users from the API response
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