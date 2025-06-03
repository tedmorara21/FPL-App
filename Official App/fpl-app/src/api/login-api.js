import axios from "axios";

const API_URL = "https://fpl-proxy-server.onrender.com/api/login";

export const loginToApp = async ( playername, password ) => {
   /* 
      try {
         const response = await axios.get(API_URL);
         const users = response.data;

         const matchingUser = users.find( users => users.playerName === plyerName && users.passwword === password ); //RETURNS ARRAY OF UNDEFINED IF NOT FOUND

         if ( matchingUser ) {
            return {
               validity: true,
               user: matchingUser,
               message: "Logged in successfully"
            }
         } else {
            return {
               validity: false,
               message: "Invalid username or password"
            } 
         }
      } catch (error) {
         console.log("Login error: ", error);
         return {
            validity: false,
            message: "Server error"
         }
      }
   */

   try {
      const response = await axios.post(API_URL, {
         playerName: playername,
         password: password
      })

      return {
         validity: true,
         user: response.data.user,
         user_name: response.data.user.playerName,
         message: response.data.message,
         token: response.data.token,
         decodedToken: response.data.decodedToken
      }
   } catch ( error ) {
      return {
         validity: false,
         message: error.response?.data?.message || "Login failed!"
      }
   }
}