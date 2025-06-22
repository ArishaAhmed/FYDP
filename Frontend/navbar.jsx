// import { useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import Logo from "./assets/logo.png";
// import "./navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [profilePicUrl, setProfilePicUrl] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const checkLogin = () => {
//       const token = localStorage.getItem("authToken");
//       const profilePic = localStorage.getItem("profilePicUrl"); 
//       setIsLoggedIn(!!token);
//       setProfilePicUrl(profilePic);
//     };

//     checkLogin();

//     window.addEventListener("loginStatusChanged", checkLogin);

//     return () => {
//       window.removeEventListener("loginStatusChanged", checkLogin);
//     };
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("profilePicUrl");
//     window.dispatchEvent(new Event("loginStatusChanged"));
//     setIsLoggedIn(false);
//     alert("Logged out successfully!");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo-container">
//         <img src={Logo} alt="BotCraft Logo" className="logo-img" />
//         <span className="logo-text">BotCraft</span>
//       </div>

//       <div className={`nav-links ${menuOpen ? "active" : ""}`}>
//         <a href="/">Home</a>
//         <a href="/about">About</a>
//         <a href="/pricing">Pricing</a>
//         <a href="/guidelines">Guidelines</a>
//         <a href="/faqs">FAQs</a>
//       </div>

//       <div className="auth-buttons desktop-auth">
//         {isLoggedIn ? (




// <div className="profile-dropdown" ref={dropdownRef}>
//   <div
//     className="profile-icon"
//     onClick={() => setDropdownOpen((prev) => !prev)}
//   >
//     👤
//   </div>

//   {dropdownOpen && (
//     <div className="dropdown-menu">
//       <button onClick={() => navigate("/profile")}>Profile</button>
//       <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   )}
// </div>
//         ) : (
//           <>
//             <button className="login" onClick={() => navigate("/login")}>
//               Login
//             </button>
//             <button className="signup" onClick={() => navigate("/signup")}>
//               Signup
//             </button>
//           </>
//         )}
//       </div>

//       <div className="hamburger" onClick={toggleMenu}>
//         ☰
//       </div>
//     </nav>
//   );
// };

// export default Navbar;















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo.png'; // Adjust path as needed
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("authToken");
      const initial = localStorage.getItem("userInitial");
      setIsLoggedIn(!!token);
      setUserInitial(initial || '?'); // Fallback to '?' if no initial
    };

    checkLogin();

    window.addEventListener("loginStatusChanged", checkLogin);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInitial"); // Clear userInitial on logout
    window.dispatchEvent(new Event("loginStatusChanged"));
    setIsLoggedIn(false);
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="BotCraft Logo" className="logo-img" />
        <span className="logo-text">BotCraft</span>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/pricing">Pricing</a>
        <a href="/guidelines">Guidelines</a>
        <a href="/faqs">FAQs</a>
      </div>

      <div className="auth-buttons desktop-auth">
        {isLoggedIn ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              className="initial-button"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {userInitial}
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="loginn" onClick={() => navigate("/login")}>Login</button>
              <button className="signupp"  onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;








// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Logo from "./assets/logo.png";
// import "./navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // ✅ Check login status and listen for login/logout events
//   useEffect(() => {
//     const checkLogin = () => {
//       const token = localStorage.getItem("authToken");
//       setIsLoggedIn(!!token);
//     };

//     checkLogin(); // Initial check

//     // Listen for custom login/logout events
//     window.addEventListener("loginStatusChanged", checkLogin);

//     return () => {
//       window.removeEventListener("loginStatusChanged", checkLogin);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const handleLogout = () => {
//     // Remove token from localStorage
//     localStorage.removeItem("authToken");
  
//     // Dispatch an event to notify other components about the logout
//     window.dispatchEvent(new Event("loginStatusChanged"));
  
//     // Update local state and navigate
//     setIsLoggedIn(false);
//     alert("Logged out successfully!");
//     navigate("/login"); // Redirect to login page after logout
//   };
//   console.log(isLoggedIn,"login")
//   return (
//     <nav className="navbar">
//       <div className="logo-container">
//         <img src={Logo} alt="BotCraft Logo" className="logo-img" />
//         <span className="logo-text">BotCraft</span>
//       </div>
  
//       {/* Always show navigation links */}
//       <div className={`nav-links ${menuOpen ? "active" : ""}`}>
//         <a href="/">Home</a>
//         <a href="/about">About</a>
//         <a href="/pricing">Pricing</a>
//         <a href="/guidelines">Guidelines</a>
//         <a href="/faqs">FAQs</a>
//       </div>
  
//       {/* Show auth buttons conditionally */}
//       <div className="auth-buttons desktop-auth">
//         {isLoggedIn ? (
//           <button className="logout" onClick={handleLogout}>
//             Logout
//           </button>
//         ) : (
//           <>
//             <button className="login" onClick={() => navigate("/login")}>
//               Login
//             </button>
//             <button className="signup" onClick={() => navigate("/signup")}>
//               Signup
//             </button>
//           </>
//         )}
//       </div>
  
//       <div className="hamburger" onClick={toggleMenu}>
//         ☰
//       </div>
//     </nav>
//   );
// }
// export default Navbar; 
