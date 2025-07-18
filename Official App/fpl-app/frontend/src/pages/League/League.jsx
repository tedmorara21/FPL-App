import { useEffect, useState } from "react";

// import { userContext } from "../../assets/UserContext.jsx";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
// import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import { getLeagueStandings } from "../../api/league-api.js";

import "./League.css";


const League = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect( () => {
    let isMounted = true; /* PREVENT STATE UPDATE AFTER UNMOUNTING */

    const fetchData = async () => {
        const data = await getLeagueStandings();
        if (isMounted) {
          setUsers(data); /* SET CORRECT USERS DATA */
          setLoading(false);
        }
    }

    fetchData();

    return () => { isMounted = false; }; /* CLEANUP */
  }, [] );

  if (loading) return <p>Loading league data...</p> 

  if (!users || users.length === 0) return <p>No league data available.</p>; 

   return (
      <>
        <div className="league-body"> 

          {/* <HomeButton /> */}
          <ProfileHeader />

        <h1>🏆 Fantasy League Standings</h1>


        <div className="league-table-container">
          <table border="1">
          <thead>
            <tr>
              <th> Rank </th>
              <th> Name </th>
              <th> Points </th>
              <th> Earned This Gw </th>
              <th> Total Points </th>
              <th> Total Money Earned </th>
            </tr>
          </thead>
          <tbody>
        {users.map((user) => (
          <tr key={user.entry}>
            <td>{user.rank}</td>
            <td>{user.entry_name}</td> 
            <td>{user.event_total}</td>
            <td>{0.00}</td>
            <td>{user.total}</td>
            <td>{0.00}</td> 
          </tr>
        ))}
      </tbody>
        </table>
        </div>
        
        </div>
      </>
   );
 };
 
 export default League;
 
