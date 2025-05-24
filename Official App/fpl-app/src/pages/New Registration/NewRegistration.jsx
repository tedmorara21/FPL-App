import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
 
import "../New Registration/NewRegistration.css";

import { checkUserExists } from '../../functions/check-user-exists';

const NewRegistration = () => {
   const navigate = useNavigate();

   const [ playerName, setPlayerName ] = useState('');
   const [ email, setEmail ] = useState('');
   const [ phoneNumber, setPhoneNumber ] = useState('');
   const [ password, setPassword ] = useState('');
   const [ confirmPassword, setConfirmPassword ] = useState(''); 

   const confirmPasswordFunction = async () => {
      // CHECK PHONE NUMBER LENGTH == 10 DIGITS
      if (phoneNumber.length !== 10) {
         alert("Check phone number!");
         return;
      }

      // CHECK IF PASSWORDS MATCH
      if ( password !== confirmPassword) {
         alert("Passwords do not match!")
         return;
      } 
      
      // CHECK IF PLAYERNAME EXISTS IN DATABASE
      try {
         const response = await fetch("https://fpl-proxy-server.onrender.com/api/league");
         const data = await response.json();

         const leagueTeams = data.standings.results;
         const teamExists = leagueTeams.some(team => team.player_name === playerName)

         if (!teamExists) {
            alert("No such team name found in the FPL league!")
         } else { 
            const userExists = await checkUserExists(playerName);

            if (userExists === true) {
               alert("Player already registered!");
               return;
            } else if (userExists === undefined) {
               alert("Server error. Try again later!");
               return;
            }
            //IF MATCH IS FOUND, PROCEED
            const newRegistrationData = { playerName, email, phoneNumber, password };

            // console.log("Registration Data: ", newRegistrationData);
            
            //SEND DATA TO MONGODB HERE
            try {
               const res = await fetch("https://fpl-proxy-server.onrender.com/api/users", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify( { playerName, email, phoneNumber, password} )
               });

               if (!res.ok) {
                  const errorData = await res.json();
                  alert(`Registration Failed: ${errorData.error || "Uknown error"}`);
                  return;
               }

               const data = await res.json();

               // console.log("User saved to Mongodb", data);

               //RESET FORM
               alert("Account created!");
               setPlayerName("");
               setEmail("");
               setPhoneNumber("");
               setPassword("");
               setConfirmPassword("");

               //REDIRECT
               navigate("/");
            } catch (error) {
               console.error("Error saving user to Mongodb by Guzuuu: ", error);
            }
         }
      } catch ( error ) {
         console.error("Error checking team name by Guzuuu: ", error);
         alert('Something went wrong.Please try again.');
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

               <div className='input-group'>
               <label> Player Name </label>
                  <input 
                     type="text" 
                     value={playerName} 
                     onChange={(e) => setPlayerName(e.target.value)}
                     placeholder="Name As It Is In FPL League" 
                     required
                  />
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
               </div>

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
