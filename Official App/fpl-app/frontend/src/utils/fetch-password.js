import axios from "axios"

export const fetchPassword = async (playerName) =>  {
    try {
        const response = await axios.get("http://localhost:5001/api/users"); // CHANGE LATER!!!!!!!!!!!!!!!!!!
        const users = response.data;

        const user = users.find( (user) => user.playerName === playerName );

        if (user) {
            return user.password;
        } else {
            return null;
        }
    } catch (err) {
        console.log("Error fetcching password: ", err);
        return null;
    }
}
