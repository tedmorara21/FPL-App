import { Link } from "react-router-dom";
import "./ProfileHeader.css";

const ProfileHeader = ( { name, balance, points } ) => {
   return (
      <>
      <div className="profile-header" >
         <span className="profile-item" >🏆 { name } </span> <br />
         <span className="profile-item" >💰 { balance } shs</span> <br />
         <span className="profile-item" >⭐ { points } points</span> <br />
      </div>
      </>
   )
}

export default ProfileHeader;