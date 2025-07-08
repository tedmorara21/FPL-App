const axios = require('axios');
const dotenv = require('dotenv').config();

const getAccessTokenFunction = async () => {
    const consumer_key = process.env.CONSUMER_KEY;
    const consumer_secret = process.env.CONSUMER_SECRET;
    const authorization_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const auth = "Basic " + Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

    try {
        const response = await axios.get( authorization_URL, {
            headers: { Authorization: auth }
        } );

        const accessToken = response.data.access_token;
        /* const expires_in = response.data.expires_in; */

        return accessToken;
    } catch (err) {
        throw err;
    }
}

module.exports = { getAccessTokenFunction };
