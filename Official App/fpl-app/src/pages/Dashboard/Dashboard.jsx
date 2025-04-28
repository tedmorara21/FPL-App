import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import HomeButton from "../../components/HomeButton/HomeButton";
import "./Dashboard.css"

const Dashboard = () => {

  const navigate = useNavigate();

   return (
     <>
     <div class="dashboard-body">
        <div>
            <HomeButton />
        </div>

       <h1>DASHBOARD</h1>
       <p class="dashboard-welcome">Welcome to your dashboard <span className="highlight"> TEAMNAME </span>!</p>
       <>
        <ProfileHeader name={"Ted"} balance={1000} points={1783}/>
       </>

        <div class="dashboard-section">
          <p><strong>Profile Name : </strong> "PROFILENAME"</p> 
          <p><strong>Team Name : </strong> "TEAMNAME" </p>
        </div>

        <p class="dashboard-section">
          <p><strong>Balance = </strong>"0.00"</p>
          <button 
              class="dashboard-button" 
              onClick={ () => navigate("/balance")}
          >Withdraw</button> 
        </p>

        <p class="dashboard-section">
          <p><strong>Points this GW : </strong>"0"</p>
          <p><strong>Total Points : </strong>"0"</p>
          <button 
              class="dashboard-button" 
              onClick={ () => navigate("/league")}
              >League Standings</button>
       </p>
       
       </div>
     </>
   );
 };
 
 export default Dashboard;
 