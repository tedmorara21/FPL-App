import { Link } from "react-router-dom";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">DASHBOARD</h2>
      <ul>
        <li>
          <Link to="dashboard/" className="sidebar-link">
            <FiHome className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/league" className="sidebar-link">
            <FaTrophy className="icon" /> League
          </Link>
        </li>
        <li>
          <Link to="/balance" className="sidebar-link">
            <FiUser className="icon" /> Balance
          </Link>
        </li>
        <li>
          <Link to="/settings" className="sidebar-link">
            <FiLogOut className="icon" /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
