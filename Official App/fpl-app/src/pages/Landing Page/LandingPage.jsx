import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { loginToApp } from '../../api/login-api';

import "../Landing Page/LandingPage.css";

const LandingPage = () => {
   const [ playername, setPlayerName ] = useState('');
   const [ password, setPassword] = useState('');
   const [ serverDown, setServerDown ] = useState(false);

   const navigate = useNavigate();

   useEffect ( () => {
      const checkServer = async () => {
         try {
            await axios.get("https://fpl-proxy-server.onrender.com/api/users");
         } catch (error) {
            setServerDown(true);
         }
      }

      checkServer();
   }, [] );


   const handleLogin = async () => {
      if ( playername === '' || password === '' ) {
         alert ("Enter both username and password");
         return;
      };

      // SEND CREDENTIALS TO BACKEND   
      const result = await loginToApp( playername, password );
      
      if (result.validity === true) {
         //SUCCESSFUL LOGIN
         localStorage.setItem("authtoken", result.token);

         alert(`Welcome ${playername}`);
         navigate("/dashboard");
      } else {
         console.log("Error logging in")
         alert(result.message);
      }
   }

   if (serverDown) {
      return (
         <div className='landing-container'>
            <h1>⚠️ Servers are down by Guzuuu</h1>
            <p>Please try again later</p>
         </div>
      )
   }

   return (
      <div className='landing-container'>
         <h1>Welcome To FPL</h1>

         <div className='input-group'>
            <label htmlFor='username'>Team Name: </label>
            <input 
               type='text'
               id='username'
               name='username'
               value={playername}
               onChange={(e) => setPlayerName(e.target.value)}
               placeholder='Enter team name as it is in FPL'
            />
         </div>

         <div className='input-group'>
            <label htmlFor='password'>Password: </label>
            <input 
               type='password'
               id='password'
               name='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder='Enter your password'
            />
         </div>

         <button onClick={handleLogin}>Login</button>

         <Link to="/new-registration">
            <button>Register</button>
         </Link>

      </ div>
   )
}

export default LandingPage;