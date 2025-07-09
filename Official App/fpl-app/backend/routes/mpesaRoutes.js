const express = require('express');
const router = express.Router();

const {
    mpesaHome,
    getAccessToken,
    initiateSTKPush,
    receiveCallback,
} = require('../controllers/mpesaController');

router.get( "/home" , mpesaHome );

router.get( "/get-access-token", getAccessToken );

router.post( "/stk-push", initiateSTKPush );

router.post( "/callback", receiveCallback );

///////////////////////////////////////////////////////////////

module.exports = router;
