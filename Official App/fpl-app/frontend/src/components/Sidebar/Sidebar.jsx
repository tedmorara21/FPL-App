import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiLogOut, FiSettings, FiUsers, FiDatabase } from "react-icons/fi";
import { FaTrophy, FaTools } from "react-icons/fa";

import getUserRole from "../../utils/get-user-roles";

import "./Sidebar.css";

const Sidebar = () => {
  const [ collapsed, setCollapsed ] = useState(false);
  const role = getUserRole();

  function toggleSidebar () {
    setCollapsed( prev => !prev );
  }

  const renderLinks = links => 
    links.map( ( { to, icon: Icon, label } ) => (
      <li key={to}>
        <Link to={to} className="sidebar-link">
          <Icon className="icon" />
          <span className="link-text"> {label} </span>
        </Link>
      </li>
    ) );

    const userLinks = [
      { to: "/dashboard", icon: FiHome, label: "Dashboard" },
      { to: "/league", icon: FaTrophy, label: "League" },
      { to: "/balance", icon: FiUser, label: "Balance" },
      { to: "/settings", icon: FiSettings, label: "Settings" },
      { to: "/login", icon: FiLogOut, label: "Logout" }
    ]

    const adminLinks = [
      { to: "/dashboard", icon: FiHome, label: "Dashboard" },
      { to: "/admin/dashboard", icon: FaTools, label: "Admin Panel" },
      { to: "/league", icon: FaTrophy, label: "League" },
      { to: "/balance", icon: FiUser, label: "Balance" },
      { to: "/admin/manage-users", icon: FiUsers, label: "Manage Users" },
      { to: "/admin/data", icon: FiDatabase, label: "Data Insights" },
      { to: "/settings", icon: FiSettings, label: "Settings" },
      { to: "/login", icon: FiLogOut, label: "Logout" }
    ]

    return (
      <div className={`sidebar ${ collapsed ? "collapsed" : "" }`}>
        <div className="toggle-btn" onClick={toggleSidebar}>
          { collapsed ? "☰" : role === "admin" ? "☰ Admin Panel" : "☰ Dashboard" }
        </div>
        <ul> { renderLinks( role === "admin" ? adminLinks : userLinks ) } </ul>
      </div>
    )
}

export default Sidebar;
