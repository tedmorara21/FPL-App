import { useEffect, useState } from "react";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import { getLeagueStandings } from "../../api/league-api.js";
import "./League.css";


const League = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect( () => {
    let isMounted = true; // Prevent state update after unmounting

    const fetchData = async () => {
      console.log("Fetching data from: URL");
        const data = await getLeagueStandings();
        console.log("Fetched Users: " , data);  // Debugging
        if (isMounted) {
          setUsers(data); // Set correct users data
          setLoading(false);
        }
    }

    fetchData();

    return () => { isMounted = false; }; // Cleanup
  }, [] );

  if (loading) return <p>Loading league data...</p> 
  if (!users || users.length === 0) return <p>No league data available.</p>; // Debugging

   return (
      <>
        <ProfileHeader name={"Ted"} balance={1000} points={1783}/>

        <div>
        <h1>🏆 Fantasy League Standings</h1>

        <ul>
          {users.map((user) => (
            <li key={user.entry}>
                {user.rank}. {user.player_name} - {user.entry_name} (Points : {user.total})
            </li>
          ))}
        </ul>
        
        </div>
      </>
   );
 };
 
 export default League;
 