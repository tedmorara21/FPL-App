import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import HomeButton from "../../components/HomeButton/HomeButton";
import "./Dashboard.css"

const Dashboard = () => {

  const navigate = useNavigate();

   return (
     <>
     <div className="dashboard-body">
        <div>
            <HomeButton />
        </div>

       <h1>DASHBOARD</h1>
       <div className="dashboard-welcome">Welcome to your dashboard <span className="highlight"> TEAMNAME </span>!</div>
       <>
        <ProfileHeader name={"Ted"} balance={1000} points={1783}/>
       </>

        <div className="dashboard-section">
          <p><strong>Profile Name : </strong> "PROFILENAME"</p> 
          <p><strong>Team Name : </strong> "TEAMNAME" </p>
        </div>

        <div className="dashboard-section">
          <p><strong>Balance = </strong>"0.00"</p>
          <button 
              className="dashboard-button" 
              onClick={ () => navigate("/balance")}
          >Withdraw</button> 
        </div>

        <div className="dashboard-section">
          <p><strong>Points this GW : </strong>"0"</p>
          <p><strong>Total Points : </strong>"0"</p>
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
 