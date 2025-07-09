const express = require('express');
const router = express.Router();

const cors = require('cors');
router.use(cors()); // allow all origins

const {
    getLeagueData,
    getRegisteredUsers,
    registerUser,
    loginUser,
    getUserDetails,
    changePhoneNumber,
    changePassword,
    changeUsername
} = require('../controllers/userController')

const { authenticateToken, authorizeAdmin } = require("../middleware/auth")

router.get( "/league", getLeagueData );

router.get( "/users", getRegisteredUsers );

router.post( "/users", registerUser );

router.post( "/login", loginUser );

router.get( "/get-user-details", authenticateToken, getUserDetails );

router.put( "/change-phone-number", authenticateToken,  changePhoneNumber );

router.put( "/change-password", authenticateToken, changePassword );

router.put( "/change-username", authenticateToken, changeUsername );


module.exports = router;
