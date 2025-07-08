import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ( {children} ) => {
   const [ userData, setUserData ] = useState(null);

   useEffect( () => {
      const token = localStorage.getItem("authToken");

      async function fetchUserData() {
         if (!token) {
            return;
         }

         try {
            /* GET USER DETAILS */
            const response1 = await axios.get("http://localhost:5001/api/get-user-details", {  // CHANGE LATER!!!!!!!!!!!!!!!!!!
               headers: { Authorization: `Bearer ${token}` },
            });

            const responseDetails = response1.data.user; // OBJECT

            /* GET FPL LEAGUE STANDINGS */
            const response2 = await axios.get("http://localhost:5001/api/league"); // CHANGE LATER!!!!!!!!!!!!!!!!!!
            const standingsArray = response2.data.standings.results; // object

            /* FIND USER IN LEAGUE STANDINGS USING FPL ID */
            const currentUserStanding = standingsArray.find( 
               (entry) => entry.entry === responseDetails.fpl_id
            );

            if (!currentUserStanding) {
               console.log("Player not found in FPL standings: ", responseDetails.playerName);
               return;
            }

            const userData = {
               fpl_id: responseDetails.fpl_id,
               user_name: responseDetails.userName,
               player_name: responseDetails.playerName,
               team_name: responseDetails.teamName,
               email: responseDetails.email,
               phone_number: responseDetails.phoneNumber,
               balance: responseDetails.balance,
               money_earned: responseDetails.moneyEarned,

               gw_points: currentUserStanding.event_total,
               rank: currentUserStanding.rank_sort,
               total_points: currentUserStanding.total
            }

            setUserData(userData);
         } catch (err) {
            console.error("Failed to fetch users: ", err);
         }
      }

      fetchUserData();
   }, [] );

   return (
      <UserContext.Provider value={{userData, setUserData}}>
         {children}
      </UserContext.Provider>
   )
} 
