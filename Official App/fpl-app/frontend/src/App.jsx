import React, { useState } from 'react'
import "normalize.css" // normalize styles for multiple browsers
import './App.css'
import { Routes, Route, Link, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import AdminRoute from './components/AdminRoute.jsx';

import { UserProvider } from "./assets/UserContext.jsx";

import Sidebar from "./components/Sidebar/Sidebar";

import Dashboard from "./pages/Dashboard/Dashboard";
import League from './pages/League/League.jsx';
import Balance from "./pages/Balance/Balance.jsx";
import Login from "./pages/Login Page/Login.jsx";
import LandingPage from './pages/Landing Page/LandingPage.jsx';
import NewRegistration from './pages/New Registration/NewRegistration.jsx';
import Settings from './pages/Settings/Settings.jsx';

import AdminDashboard from './admin/adminDashboard.jsx';
import ManageUsers from './admin/manageUsers.jsx';

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
      <div className="app-container">

      {/* Sidebar */}
      { showSidebar ? <Sidebar /> : null }

      {/* Main Content */}
      <div className={`main-content ${showSidebar ? "with-sidebar" : "full-width"} `}>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={< LandingPage />} />
          <Route path="/new-registration" element={< NewRegistration />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="/admin/manage-users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <UserProvider>
              <ProtectedRoute> < Dashboard /> </ProtectedRoute>
            </UserProvider>
          } />

          <Route path="/league" element={
            <UserProvider>
              <ProtectedRoute> < League /> </ProtectedRoute>  
            </UserProvider>
          } />

          <Route path="/balance" element={
            <UserProvider>
              <ProtectedRoute> < Balance /> </ProtectedRoute>
            </UserProvider>
          } />

          <Route path="/login" element={
            <UserProvider>
              <ProtectedRoute> < Login /> </ProtectedRoute>
            </UserProvider>
          } />

          <Route path='/settings' element={
            <UserProvider>
              <ProtectedRoute> <Settings /> </ProtectedRoute>
            </UserProvider>
          }/>
          
        </Routes>
      </div>
    </div>
  );
}

export default App;
