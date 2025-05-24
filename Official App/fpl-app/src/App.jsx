import { useState } from 'react'
import './App.css'
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import League from './pages/League/League.jsx';
import Balance from "./pages/Balance/Balance.jsx";
import Login from "./pages/Login Page/Login.jsx";
import LandingPage from './pages/Landing Page/LandingPage.jsx';
import NewRegistration from './pages/New Registration/NewRegistration.jsx';

function App() {
  const location = useLocation();

  const isLandingpage = location.pathname === '/' || location.pathname === "/new-registration";

  let showSidebar = false;
  if (!isLandingpage) {
    showSidebar = true;
  }

  return (
    <div className="app-container">

      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={< LandingPage />} />
          <Route path="/dashboard" element={< Dashboard />} />
          <Route path="/league" element={< League />} />
          <Route path="/balance" element={< Balance />} />
          <Route path="/login" element={< Login />} />
          <Route path="/new-registration" element={< NewRegistration />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
