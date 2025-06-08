import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ( {children} ) => {
   const { userData, setUserData } = useState(null);

   useEffect( () => {
      const token = localStorage.getItem("authToken");

      async function fetchUserData() {
         if (!token) {
            return;
         }

         try {
            const response1 = await axios.get("https://fpl-proxy-server.onrender.com/api/get-user-details", {
               headers: { Authorization: `Bearer ${token}` },
            });

            const responseDetails = response1.data.user;
            // console.log("Response Details: ", responseDetails); // object

            const response2 = await axios.get("https://fpl-proxy-server.onrender.com/api/league");

            const standingsArray = response2.data.standings.results;
            //console.log("Stndings Array: ", standingsArray); //object

            const currentUserStanding = standingsArray.find( (entry) => entry.player_name === responseDetails.playerName )

            if (!currentUserStanding) {
               console.log("Player not fuond in FPL standings: ", responseDetails.playerName);
               return;
            }

            const userData = {
               user_id: responseDetails.id,
               player_name: responseDetails.playerName,
               team_name: responseDetails,teamName,
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