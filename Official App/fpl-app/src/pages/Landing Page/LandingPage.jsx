import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "../Landing Page/Landingpage.css";

const LandingPage = () => {
   const [ username, setUsername ] = useState('');
   const [ password, setPassword] = useState('');

   const navigate = useNavigate();

   const handleLogin = () => {
      if ( username === '' || password === '' ) {
         alert ("Enter both username and password");
      } else {
         // Continue with login logic here         
         console.log("Logging in with:", { username, password });
         navigate("/dashboard");
      }    
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
               value={username}
               onChange={(e) => setUsername(e.target.value)}
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