const express =  require('express');
const dotenv = require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
const cors = require('cors');
const ngrok = require('@ngrok/ngrok');

const { getAccessTokenFunction } = require('../utils/mpesa-Utils');


exports.mpesaHome = async (req, res) => {
    try {
        res.send("Home route reached");
    } catch (err) {
        res.status(500).json({
            message: "Error accessing route page",
            error: err
        })
    }
}

exports.getAccessToken = async (req, res) => {
    try {
        const accessToken = await getAccessTokenFunction();
        res.status(200).json({
            Token: accessToken
        })
    } catch (err) {
        res.status(500).json({ 
            message: `Error fetching token: ${err}`
         })
    }
}

exports.initiateSTKPush = async (req,res) => {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    try {
        const accessToken = await getAccessTokenFunction();
        const auth = `Bearer ${accessToken}`;
        const timestamp = moment().format("YYYYMMDDHHmmss");

        const shortCode = "174379";
        const passkey = process.env.PASSKEY;
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

        // const phoneNumberOriginal = phoneNumber;
        // const amount_to_pay = amount

        const body = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: 1,
            PartyA: "254745700178", // REMOVE LATER
            PartyB: shortCode,
            PhoneNumber: "254745700178", // REMOVE LATER
            CallBackURL: "https://2ea6-197-232-36-21.ngrok-free.app/mpesa-api/callback",
            AccountReference:"Test",
            TransactionDesc: "Pay Money to Ganji Ndo Inabonga"
        };

        const response = await axios.post( url, body, {
            headers: { Authorization: auth }
        } )

        res.status(200).json({
            message: "STK Push Initiated",
            data: response.data
        })
    } catch (err) {
        res.status(500).json({
            message: "STK Push failed",
            error: err.response?.data || err.message
        })
    }
}

exports.receiveCallback = async (req,res) => {
    try {
        const callbackData = req.body;

        /* remove for future */
        console.log("STK Callback received: ", JSON.stringify(callbackData, null, 2));

        res.status(200).json({
            message: "Callback received successfully",
            transactionData: JSON.stringify(callbackData, null, 2)
        })
    } catch (err) {
        res.status(500).json({
            message: `Error in callback handler: ${err}`
        })
    }
}
