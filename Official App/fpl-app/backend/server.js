const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require("./routes/userRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");

/* CONFIG THE SERVER */
/***********************************************************/
const server = express();
server.use(express.json());  // to parse json request body 
server.use(cors()); // enable cors
dotenv.config();
/**********************************************************/

const mongodb_URL = process.env.MONGODB_CONNECTION;
const PORT = process.env.PORT || 5001;


/* MONGODB CONNECTION */
mongoose.connect(mongodb_URL)
   .then( ()=> {
      console.log('MongoDB connected');

      /* START THE SERVER */
      server.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}.`)
      })

      setTimeout( () => {
         console.log("Server is set up and ready to go!")
      }, 2500 );
   } )
   .catch( err => console.error("MongoDB connection error: ", err) );


/* ROUTES */
server.use( "/api", userRoutes ); /* USER ROUTES */
server.use( "/mpesa-api", mpesaRoutes ); /* MPESA ROUTES */
