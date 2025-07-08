import axios from "axios";

const API_URL = "https://fpl-proxy-server.onrender.com/api/login";

export const loginToApp = async ( player_name, password ) => {
   try {
      const response = await axios.post(API_URL, {
         playerName: player_name,
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
   } catch (err) {
      return {
         validity: false,
         message: err.response?.data?.message || "Login failed!"
      }
   }
}
