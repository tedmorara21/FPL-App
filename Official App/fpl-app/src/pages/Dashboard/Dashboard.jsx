import { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import { UserContext } from '../../assets/UserContext';

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import HomeButton from "../../components/HomeButton/HomeButton";
import "./Dashboard.css"

const Dashboard = () => {

  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  if (!userData) {
    return (
      <p>
        Loading...
      </p>
    )
  }

   return (
     <>
     <div className="dashboard-body">
        <div>
            <HomeButton />
        </div>

       <h1>DASHBOARD</h1>

       <div className="dashboard-welcome">Welcome to your dashboard <span className="highlight"> {userData.team_name} </span>!</div>

        <ProfileHeader />

        <div className="dashboard-section">
          <p><strong>Profile Name : </strong> {userData.player_name} </p> 
          <p><strong>Team Name : </strong> {userData.team_name} </p>
        </div>

        <div className="dashboard-section">
          <p><strong>Balance = </strong>{userData.balance}</p>
          <button 
              className="dashboard-button" 
              onClick={ () => navigate("/balance")}
          >Withdraw</button>
          <p><strong>Total Points : </strong> {userData.money_earned} </p> 
        </div>

        <div className="dashboard-section">
          <p><strong>Points this GW : </strong> {userData.gw_points} </p>
          <p><strong>Total Points : </strong> {userData.total_points} </p>
          <button 
              className="dashboard-button" 
              onClick={ () => navigate("/league")}
              >League Standings</button>
       </div>
       
       </div>
     </>
   );
 };
 
 export default Dashboard;
 