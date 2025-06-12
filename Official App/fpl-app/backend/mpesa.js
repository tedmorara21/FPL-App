const express = require('express');
const mpesa_server = express();

const axios = require("axios");
const moment = require('moment');
const router = express.Router();
// const apiRouter = require('./mpesa-api');
const cors = require("cors");

const ngrok = require("@ngrok/ngrok");

const port = 5002; //not needed tho
mpesa_server.use(express.json());
// mpesa_server.use(bodyParser.json());
mpesa_server.use(cors());
// mpesa_server.use('/', apiRouter);


// ENDPOINTS

/* 
---getAccessToken()
---.get("/home")
---.get("/get-access-token")
*/

mpesa_server.get("/home", (req, res) => {
    try {
        res.send("Home router"); 
    } catch (err) {
        res.status(500).json({
            message: `Error accessing route page "/"`,
            error: err
        })
    }
})

async function getAccessToken () {
    const consumer_key = "bRA1uKAhu65JemjL8sZOw5xyGxULxOvUAW7GRTrs3dsTTLLB";
    const consumer_secret = "AMsDlCTQAK29tihc8REFAdoyskrvrQQjb4aIMcQ5IwWIjfEhuPTpAzmBpon8JvIY";
    const authorization_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = "Basic " + new Buffer.from(consumer_key + ":" + consumer_secret).toString('base64');

    try {
        const response = await axios.get(authorization_URL, {
            headers: {
                Authorization: auth
            }
        })

        const accessToken = response.data.access_token;
        return accessToken;
    } catch (err) {
        throw err;
    }
} 

mpesa_server.get("/get-access-token", async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        res.status(200).json({
            Token: accessToken
        })
    } catch (err) { 
        res.send("Error fetching Token");
    }
})

mpesa_server.post("/stk-push", async (req, res) => {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    /*
    const amount = req.body.amount;
    const phoneNumber = req.body.phoneNumber;
    // const { amount, phoneNumber } = req.body;

    
    if (!phoneNumber) {
        return (
            res.status(400).json({
                message: "Phone number required"
            })
        )
    }*/
    
    try {
        const accessToken = await getAccessToken();
        const auth = `Bearer ${accessToken}`;
        const timestamp = moment().format("YYYYMMDDHHmmss");
        
        const shortCode = "174379";
        const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

        // const phoneNumberOriginal = phoneNumber;
        // const amount_to_pay = amount;

        const body = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: 1,
            PartyA: "254745700178", // phone number that will receive the stkpush
            PartyB: shortCode, // paybill/till number
            PhoneNumber: "254745700178",
            CallBackURL: "https://7e39-197-232-36-21.ngrok-free.app/mpesa-api/callback", 
            AccountReference: "Test",
            TransactionDesc: "Pay Money to Ganji Ndo Inabonga"
        };

        const response = await axios.post(url, body, {
            headers: {
                Authorization: auth
            }
        });

        res.status(200).json({
            message: "STK Push initiated",
            data: response.data
        })
    } catch (err) {
        res.status(500).json({
            message: "STK Push failed",
            error: err.response?.data || err.message
        })
    }
})

mpesa_server.post("/callback", async (req, res) => {
    try {
        const callbackData = await req.body;

        console.log("STK Callback Received:", JSON.stringify(callbackData, null, 2));

        res.status(200).json({
            message: "Callback received successfully",
            transactionData: JSON.stringify(callbackData)
        });

    } catch (err) {
        res.status(500).json({
            message: "Error in callback handler",
            error: err
        })
    }
})

module.exports = {
    mpesaServer: mpesa_server
}
