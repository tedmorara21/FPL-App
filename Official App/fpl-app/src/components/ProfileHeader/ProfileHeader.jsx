import { useContext } from "react";

import { UserContext } from "../../assets/UserContext";

import "./ProfileHeader.css";

const ProfileHeader = () => {
   const { userData } = useContext(UserContext);

   if (!userData) {
      return null;
   }

   return (
      <>
      <div className="profile-header" >
         <span className="profile-item" >🏆 { userData.team_name } </span> <br />
         <span className="profile-item" >💰 { userData.balance } shs</span> <br />
         <span className="profile-item" >⭐ { userData.total_points } points</span> <br />
      </div>
      </>
   )
}

export default ProfileHeader;