import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Importing menu icon
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove stored authentication token
    setMenuOpen(false); // Close menu after logout
    navigate("/"); // Redirect to Home page
  };

  return (
    <>
      <nav className="navbar">
        {/* Menu icon that toggles the sidebar */}
        <FaBars className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />

        {/* Mentora Title in the center */}
        <div className="navbar-title">Mentora</div>

        {/* Login button on the right */}
        <div className="navbar-buttons">
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div className={`side-menu ${menuOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>✖</button>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/chat" onClick={() => setMenuOpen(false)}>Chat</Link></li>
          <li><Link to="/mood-log" onClick={() => setMenuOpen(false)}>Mood Log</Link></li> {/* Updated Mood Log */}
          <li><Link to="/sentiment-analysis" onClick={() => setMenuOpen(false)}>Sentiment Analysis</Link></li>
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      {/* Click outside to close menu */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Navbar;


