import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import "./League.css";

const League = () => {
   return (
      <>
        <ProfileHeader name={"Ted"} balance={1000} points={1783}/>

        <div>
       <h1 className="text-2xl font-bold">👤 Profile</h1>
       <p>league table</p>
     </div>
      </>
   );
 };
 
 export default League;
 