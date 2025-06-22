import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BotCraft-login.css";
import GoogleLogo from "./assets/Google.png";
import Logo from "./assets/logo.png";

const BotCraftLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
  const newErrors = {};

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    newErrors.password = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
  }

  // If errors exist, display them and stop submission
  if (Object.keys(newErrors).length > 0) {
    setError(Object.values(newErrors).join(" "));
    return;
  }

    // Sending login request to backend API
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Storing JWT token in localStorage
        localStorage.setItem("authToken", data.access_token);
        console.log("Received token from server:", data.access_token); // ✅ Check what was received
        localStorage.setItem("userInitial", formData.email.charAt(0).toUpperCase()); // Store first letter

        // Let App.jsx know token has changed
        window.dispatchEvent(new Event("loginStatusChanged"));
  
        alert("Login successful!");
  
        // Redirect to the protected CreateBot page
        navigate("/CreateBot");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Error during login:", error);
    }
  };
  

  return (
    <div>
      {/* Decorative Diamonds */}
      <div className="diamond-container">
        <div className="diamond pink"></div>
        <div className="diamond blue"></div>
        <div className="diamond purple"></div>
      </div>

      <div className="diamond-container-two">
        <div className="diamond pink-two"></div>
        <div className="diamond blue-two"></div>
        <div className="diamond purple-two"></div>
      </div>

      {/* Login Card */}
      <div className="login-container">
        <div className="header-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="heading">BotCraft</h1>
        </div>

        <div className="cards">
          <p className="welcome">Welcome Back! Log in to continue.</p>

          <button className="google-btn">
            <img src={GoogleLogo} alt="Google Logo" width="20" />
            Sign in with Google
          </button>

          <div className="divider">or</div>

          {error && <p className="error-message">{error}</p>} {/* Error Message */}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="login-btn">
              LOG IN
            </button>
          </form>

          <p className="terms-text">
            <a href="#">Terms & Conditions and Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BotCraftLogin;







