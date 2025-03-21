import { useState } from 'react'
import './App.css'
import { Routes,Route,Link } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import League from './pages/League/League.jsx';
import Balance from "./pages/Balance/Balance.jsx";

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/league" element={<League />} />
          <Route path="/balance" element={<Balance />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
