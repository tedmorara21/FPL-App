import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
 
import "../New Registration/NewRegistration.css";

import { checkUserExists } from '../../utils/check-user-exists';

const NewRegistration = () => {
   const navigate = useNavigate();

   const [ playerName, setPlayerName ] = useState('');
   const [ email, setEmail ] = useState('');
   const [ phoneNumber, setPhoneNumber ] = useState('');
   const [ password, setPassword ] = useState('');
   const [ confirmPassword, setConfirmPassword ] = useState(''); 

   const [ successMessage, setSuccessMessage ] = useState("");
   const [ errorMessage, setErrorMessage ] = useState("");
   const [ phoneError, setPhoneError ] = useState("");
   const [ passwordError, setPasswordError ] = useState("");
   const [ usernameError, setUsernameError ] = useState("");

   const registerUserFunction = async () => {
      // CHECK PHONE NUMBER LENGTH == 10 DIGITS
      if (phoneNumber.length !== 10) {
         setPhoneError("Check phone number");
         setTimeout( () => setPhoneError(""), 2000 );
         return;
      }

      // CHECK IF PASSWORDS MATCH
      if ( password !== confirmPassword) {
         setPasswordError("Passwords do not match");
         setTimeout( () => setPasswordError(""), 2000 );
         return;
      } 

      // CHECK IF PLAYERNAME EXISTS IN DATABASE
      try {
         const response = await fetch("http://localhost:5001/api/league"); // CHANGE LATER!!!!!!!!!!!!!!!!!!
         const data = await response.json();

         const leagueTeams = data.standings.results;
         const teamExists = leagueTeams.some( team => team.player_name === playerName );

         if (!teamExists) {
            setUsernameError("No such team name found in the FPL league!");
            setTimeout( () => setUsernameError(""), 2000 );
            return;
         } else {
            const userExists = await checkUserExists(playerName);
            
            if (userExists === true) {
               setUsernameError("Player already registered!");
               setTimeout( () => setUsernameError(""), 2000 );
               return;
            } else if ( userExists === undefined ) {
               setUsernameError("Server error. Try again later!");
               setTimeout( () => setUsernameError(""), 2000 );
               return;
            }

            //IF MATCH IS FOUND, PROCEED
            const newRegistrationData = { playerName, email, phoneNumber, password };

            //SEND DATA TO MONGODB HERE
            try {
               const res = await fetch("http://localhost:5001/api/users", { // CHANGE LATER!!!!!!!!!!!!!!!!!!
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify( { playerName, email, phoneNumber, password} ) 
               });

               if (!res.ok) {
                  const errorData = await res.json();
                  setErrorMessage(`Registration failed: ${errorData.error}`)
                  setTimeout( () => setErrorMessage(""), 2000 );
                  return;
               }

               const data = await res.json();

               // RESET FORM
               setSuccessMessage("Account Created. Wait for redirect....");
               setTimeout( () => {
                  setSuccessMessage("");
                  navigate("/");
               }, 4000 );

               setPlayerName('');
               setEmail('');
               setPhoneNumber('');
               setPassword('');
               setConfirmPassword('');
            } catch (err) {
               setErrorMessage("Error saving users to Mongodb by Guzuuu ", err); 
               setTimeout( () => setErrorMessage(""), 2000 );
               return;
            }
         }
      } catch (err) {
         console.error("Error checking team name by Guzuuu:", err);
         setErrorMessage("Something went wrong. Check console.");
         setTimeout( () => setErrorMessage(""), 2000 );
         return;
      }
   }

   return (
      <>
         <div className="registration-container">
            <h1>New Registration</h1>
            <form className="new-registration-form" onSubmit={ (e) => {
               e.preventDefault();
               registerUserFunction();
            } } >

               <div className='input-group'>
                  <label> Player Name </label>
                  <input 
                     type="text" 
                     value={playerName} 
                     onChange={(e) => setPlayerName(e.target.value)}
                     placeholder="Name As It Is In FPL League" 
                     required
                  />
                  { usernameError && (
                     <span className='error-message'>{usernameError}</span>
                  ) }
               </div>

               <div className='input-group'>
                  <label> Email Address </label>
                  <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                  />
               </div>

               <div className='input-group'>
                  <label> Phone  Number (07) </label>
                  <input 
                     type="text" 
                     value={phoneNumber} 
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     required
                  />
                  { phoneError && (
                     <span className='error-message'>{phoneError}</span>
                  ) }
               </div>

               

               <div className='input-group'>
               <label> Password </label>
                  <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  /> 
               </div>

               <div className='input-group'>
                  <label> Confirm Password </label>
                  <input 
                     type="password" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required
                  />
                  { passwordError && (
                     <span className='error-message'>{passwordError}</span>
                  ) }
               </div>

               { errorMessage && (
                  <span className='error-message'>{errorMessage}</span>
               ) }

               { successMessage && (
                  <span className='success-message'>{successMessage}</span>
               ) }

               <>
               <div className='button-group'>
                     <button type="Submit" className="register-button">
                        Register
                     </button>

                     <Link to="/">
                        <button className="back-to-login-button">
                           Back To Login
                        </button>
                  </Link>
                  
               </div>
               </>
            </form>
         </div>
      </>
   )
}

export default NewRegistration;
