import React from "react";
import "./navbar.css"; // You can rename this to sidebar.css for clarity
import earistLogo from "./images/earist.png";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={earistLogo} alt="EARIST Logo" className="sidebar-logo" />
        <h2>EARIST</h2>
        <p>Internship System</p>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link">Dashboard</a>
        <a href="#" className="sidebar-link">Students</a>
        <a href="#" className="sidebar-link">Companies</a>
        <a href="#" className="sidebar-link">Internships</a>
        <a href="#" className="sidebar-link">Applications</a>
        <a href="#" className="sidebar-link">Settings</a>
      </nav>
    </div>
  );
}

export default Sidebar;
