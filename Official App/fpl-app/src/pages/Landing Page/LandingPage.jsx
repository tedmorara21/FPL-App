import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { loginToApp } from '../../api/login-api';

import "../Landing Page/LandingPage.css";

const LandingPage = () => {
   const [ playername, setPlayerName ] = useState('');
   const [ password, setPassword] = useState('');
   const [ serverDown, setServerDown ] = useState(false);
   const [ inputError, setInputError ] = useState("");
   const [ loading, setLoading ] = useState(false);
   const [ loginSuccess, setLoginSuccess ] = useState(false);

   const navigate = useNavigate();

   let errorMessage = null;
   if (inputError) {
      errorMessage = <p className="input-error">{inputError}</p>
   }

   let successfulMessage = null;
   if (loginSuccess === true) {
      successfulMessage = <p className="successful-message">Successful Login. Directing to Dashboard...</p>
   }

   useEffect ( () => {
      const checkServer = async () => {
         try {
            await axios.get("https://fpl-proxy-server.onrender.com/api/users");
            await axios.get("https://fpl-proxy-server.onrender.com/api/league");
         } catch (error) {
            setServerDown(true);
         }
      }

      checkServer();
   }, [] );


   const handleLogin = async () => {
      if ( playername === '' || password === '' ) {
         setInputError("Username and/or password required");
         setTimeout( () => setInputError(""), 1500 );
         return;
      };

      setInputError("");
      setLoading(true);

      // SEND CREDENTIALS TO BACKEND   
      const result = await loginToApp( playername, password );
      setLoading(false);
      
      if (result.validity === true) {
         //SUCCESSFUL LOGIN
         localStorage.setItem("authToken", result.token);

         setLoginSuccess(true);
         setTimeout( () => navigate("/dashboard"), 4000);
      } else {
         setInputError(result.message || "Login Failed");
         setTimeout( () => setInputError(""), 4000 );
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
      <div className="landing-container">
         <h1>Welcome To FPL</h1>

         <div className='input-group'>
            <label htmlFor='username'>Team Name: </label>
            <input 
               type='text'
               id='username'
               name='username'
               value={playername}
               onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (e.target.value !== "") setInputError("");
               }}
               placeholder='Enter team name as it is in FPL'
               disabled={ loading || loginSuccess }
            />
         </div>

         <div className='input-group'>
            <label htmlFor='password'>Password: </label>
            <input 
               type='password'
               id='password'
               name='password'
               value={password}
               onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value !== "") setInputError("");
               }}
               placeholder='Enter your password'
               disabled={ loading || loginSuccess }
            />

            {errorMessage}
            {successfulMessage}
            
         </div>

         <div className="button-group">
            <button 
               onClick={ handleLogin }
               className={ loading ? "loading-button" : "" }
               disabled={ loading || loginSuccess }
            >{ loading? "Loading..." : "Login" }
            </button>

            <Link to="/new-registration">
               <button
                  className={ loading ? "loading-button" : "" }
                  disabled={ loading || loginSuccess }
               >Register</button>
            </Link>
         </div>

      </ div>
   )
}

export default LandingPage;
