import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
 
import "../New Registration/NewRegistration.css";

const NewRegistration = () => {
   const navigate = useNavigate();

   const [ playerName, setPlayerName ] = useState('');
   const [ email, setEmail ] = useState('');
   const [ phoneNumber, setPhoneNumber ] = useState('');
   const [ password, setPassword ] = useState('');
   const [ confirmPassword, setConfirmPassword ] = useState(''); 

   const confirmPasswordFunction = async () => {
      if ( password !== confirmPassword) {
         alert("Passwords do not match!")
         return;
      } 
      
      try {
         const response = await fetch("https://fpl-proxy-server.onrender.com/api/league");
         const data = await response.json();

         const leagueTeams = data.standings.results;
         const teamExists = leagueTeams.some(team => team.player_name === playerName)

         if (!teamExists) {
            alert("No such team name found in the FPL league!")
         } else {
            //IF MATCH IS FOUND, PROCEED
            const newRegistrationData = { playerName, email, phoneNumber, password };
            console.log("Registration Data: ", newRegistrationData);
            
            //RESET FORM
            setPlayerName('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setConfirmPassword('')
            alert("Account Created!");

            //SEND DATA TO MONGODB SERVER HERE!!!!!
            await fetch("https://fpl-proxy-server.onrender.com/api/users", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ playerName, email, phoneNumber, password })
            })
            .then( res => {
               if (!res.ok) throw new Error ("Failed to register user");
               return res.json();
            })
            .then ( data => {
               console.log("User saved to MongoDB:", data);
            })
            .catch(err => {
               console.error("Error saving user to MongoDB:" ,err);
            })

            //REDIRECT
            navigate('/')
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
