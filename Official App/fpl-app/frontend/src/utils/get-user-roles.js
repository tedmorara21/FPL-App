import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        return decodedToken.role || null;
    } catch (err) {
        return null;
    }
}

export default getUserRole;
