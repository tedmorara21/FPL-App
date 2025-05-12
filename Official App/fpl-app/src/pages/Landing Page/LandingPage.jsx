import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import "../Landing Page/Landingpage.css";

const LandingPage = () => {
   const [ username, setUsername ] = useState('');
   const [ password, setPassword] = useState('');

   const handleLogin = () => {
      if ( username === '' || password === '' ) {
         alert ("Enter both username and password");
      }

      // Continue with login logic here
      console.log("Logging in with:", { username, password });
   }

   return (
      <div className='landing-container'>
         <h1>Welcome To FPL</h1>

         <div className='input-group'>
            <label htmlFor='username'>Username: </label>
            <input 
               type='text'
               id='username'
               name='username'
               placeholder='Enter username as it is in FPL'
            />
         </div>

         <div className='input-group'>
            <label htmlFor='password'>Password: </label>
            <input 
               type='password'
               id='password'
               name='password'
               placeholder='Enter your password'
            />
         </div>

         <Link to="/dashboard">
            <button onClick={handleLogin}>Login</button>
         </Link>

         <Link to="/new-registration">
            <button>Register</button>
         </Link>

      </ div>
   )
}

export default LandingPage;