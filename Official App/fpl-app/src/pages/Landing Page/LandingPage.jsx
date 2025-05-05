import { Link } from 'react-router-dom';

import "../Landing Page/Landingpage.css";

const LandingPage = () => {
   return (
      <>
         <h1>WELCOME TO FPL</h1>

         <div>
            <div>Username: <input></input></div>
            <div>Password: <input type='password'></input></div>
         </div>

         <Link to="/dashboard">
            <button>Login</button>
         </Link>

      </>
   )
}

export default LandingPage;