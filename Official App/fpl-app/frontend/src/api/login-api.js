import axios from "axios";

const API_URL = "http://localhost:5001/api/login"; // CHANGE LATER !!!!!!!!!!!!!!!!!!!

export const loginToApp = async ( user_name, password ) => {  
   try {
      const response = await axios.post(API_URL, {
         userName: user_name,
         password: password
      });

      return {
         validity: true,
         message: response.data.message,
         token: response.data.token,
         decodedToken: response.data.token,
         id: response.data.decodedToken.fpl_id
      }
   } catch (err) {
      return {
         validity: false,
         message: err.response?.data?.message || "Login failed!"
      }
   }
}
