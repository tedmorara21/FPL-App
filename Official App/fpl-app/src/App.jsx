import React, { useState } from 'react'
import './App.css'
import { Routes, Route, Link, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import { UserProvider } from "./assets/UserContext.jsx";

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
  // const hideSidebarRoutes = ['/', '/new-registration'];
  // const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  let showSidebar = false;
  if (!isLandingpage) {
    showSidebar = true;
  }

  return (
    <UserProvider>
      <div className="app-container">

      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <div className="main-content">

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={< LandingPage />} />
          <Route path="/new-registration" element={< NewRegistration />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute> < Dashboard /> </ProtectedRoute>} />
          <Route path="/league" element={<ProtectedRoute> < League /> </ProtectedRoute>} />
          <Route path="/balance" element={<ProtectedRoute> < Balance /> </ProtectedRoute>} />
          <Route path="/login" element={<ProtectedRoute> < Login /> </ProtectedRoute>} />
          
        </Routes>
      </div>
    </div>
    </UserProvider>
  );
}

export default App;
