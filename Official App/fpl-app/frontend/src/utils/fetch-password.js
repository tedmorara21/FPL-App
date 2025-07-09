import axios from "axios"

export const fetchPassword = async (playerName) =>  {
    try {
        const response = await axios.get("https://fpl-proxy-server.onrender.com/api/users"); 
        const users = response.data;

        const user = users.find( (user) => user.playerName === playerName );

        if (user) {
            return user.password;
        } else {
            return null;
        }
    } catch (err) {
        console.log("Error fetching password: ", err);
        return null;
    }
}
