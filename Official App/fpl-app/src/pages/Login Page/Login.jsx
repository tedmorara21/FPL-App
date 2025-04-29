//import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import HomeButton from "../../components/HomeButton/HomeButton";
import '../Login Page/Login.css';

const Login = () => {

   const navigate = useNavigate();

   return (
      <>
         <div className="login-body">
            <HomeButton />
            <ProfileHeader name={"Ted"} balance={2000} points={96}/>

            <>
               <h1>LOGIN</h1>

               <div>
                  Do you want to logout? 
               </div>

               <div>
                  <button 
                     className="yes-button"
                     onClick={() => navigate("/")}
                  >Yes</button>
                  <br /> <br />
                  <button 
                     className="no-button"
                     onClick={ () => navigate("/dashboard")}
                     >No</button>
               </div>
            </>
         </div>
      </>
   )
}

export default Login;