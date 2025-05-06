import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import "../New Registration/NewRegistration.css";

const NewRegistration = () => {
   const [ teamName, setTeamName ] = useState('');
   const [ email, setEmail ] = useState('');
   const [ phoneNumber, setPhoneNumber ] = useState('');
   const [ password, setPassword ] = useState('');
   const [ confirmPassword, setConfirmPassword ] = useState(''); 

   const confirmPasswordFunction = () => {
      if ( password !== confirmPassword) {
         alert("Passwords do not match!")
         return;
      } else {
         const newRegistrationData = { teamName, email, phoneNumber, password };
         console.log("Registration Data : ", newRegistrationData);
         setTeamName('');
         setEmail('');
         setPhoneNumber('');
         setPassword('');
         setConfirmPassword('');
         // Proceed with further actions, such as sending data to a server
      }
   }

   return (
      <>
         <div className="registration-container">
            <h1>New Registration</h1>
            <form className="new-registration-form" onSubmit={ (e) => {
               e.preventDefault();
               confirmPasswordFunction();
            } } >

               <p>
               <label> Team Name </label>
                  <input 
                     type="text" 
                     value={teamName} 
                     onChange={(e) => setTeamName(e.target.value)}
                     placeholder="Name As It Is In FPL League" 
                     required
                  />
               </p>

               <p>
               <label> Email Address </label>
                  <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                  />
               </p>

               <p>
               <label> Phone  Number (07) </label>
                  <input 
                     type="text" 
                     value={phoneNumber} 
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     required
                  />
               </p>

               <p>
               <label> Password </label>
                  <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  /> 
               </p>

               <p>
               <label> Confirm Password </label>
                  <input 
                     type="password" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required
                  />
               </p>

               <>
               <p>
                  <button type="Submit" className="register-button">
                  Register
               </button> 
               </p>

               <p>
               <button className="back-to-login-button">
                  Back To Login
               </button>
               </p>
               </>
            </form>
         </div>
      </>
   )
}

export default NewRegistration;
