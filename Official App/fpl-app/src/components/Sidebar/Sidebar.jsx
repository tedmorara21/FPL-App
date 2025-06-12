import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [ collapsed, setCollapsed ] = useState(false);

  function toggleSidebar () {
    setCollapsed( prev => !prev );
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : "" }`}>
      <div className="toggle-btn onClick={toggleSidebar}">
        ☰ Dashboard
      </div>
      
      <ul>
        
        <li>
          <Link to="dashboard/" className="sidebar-link">
            <FiHome className="icon" /> 
            <span className="link-text">Dashboard</span>
          </Link>
        </li>
        
        <li>
          <Link to="/league" className="sidebar-link">
            <FaTrophy className="icon" /> 
            <span className="link-text">League</span>
          </Link>
        </li>
        
        <li>
          <Link to="/balance" className="sidebar-link">
            <FiUser className="icon" /> 
            <span className="link-text">Balance</span>
          </Link>
        </li>
        
        <li>
          <Link to="/login" className="sidebar-link">
            <FiLogOut className="icon" /> 
            <span className="link-text">Logout</span>
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
