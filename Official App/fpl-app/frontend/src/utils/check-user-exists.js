import axios from 'axios';

const API_URL = "https://fpl-proxy-server.onrender.com/api/users";

export const checkUserExists = async( playerName ) => {
   try {
      const response = await axios.get(API_URL);
      const userData = response.data;

      //console.log("Users found by Guzuuu: ",userData);

      const userExists = userData.some( user => user.player_name === playerName );

      if (userExists) {
         return true;
      } else {
         return false;
      }

   } catch (err) {
      console.error("Error fetching users by Guzuuu: " ,err);
      return undefined;
   }
}
