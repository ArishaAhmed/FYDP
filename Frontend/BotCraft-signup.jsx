import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BotCraft-signup.css";
import GoogleLogo from "./assets/Google.png";
import Logo from "./assets/logo.png";

const BotCraftSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age_group: "",
    designation: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Email validation
    // Email validation: must be from allowed domains
  const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;
  if (!emailRegex.test(formData.email)) {
     newErrors.email = "Only Gmail, Yahoo, Outlook, or Hotmail addresses are allowed.";
}


    // Password validation: at least 8 chars, one uppercase, one lowercase, one number, one special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    }

    // Check for required fields
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!formData.age_group) newErrors.age_group = "Please select an age group.";
    if (!formData.designation) newErrors.designation = "Please select a designation.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
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

      <div className="signup-container">
        <div className="hheader-containers">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="heading">BotCraft</h1>
        </div>

        <div className="card">
          <p>Sign Up for Free. No Credit Card Required.</p>
          <p className="small-text">14-day free trial. No credit card needed.</p>

          <button className="google-btn">
            <img src={GoogleLogo} alt="Google Logo" width="20" />
            Sign in with Google
          </button>

          <div className="divider">or</div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First name"
              className="input-field"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
            {errors.first_name && <span className="error">{errors.first_name}</span>}

            <input
              type="text"
              placeholder="Last name"
              className="input-field"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
            {errors.last_name && <span className="error">{errors.last_name}</span>}

            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <select
              className="input-field"
              value={formData.age_group}
              onChange={(e) =>
                setFormData({ ...formData, age_group: e.target.value })
              }
              required
            >
              <option value="">Select Age Group</option>
              <option value="10-15">10 to 15</option>
              <option value="15-20">15 to 20</option>
              <option value="20-25">20 to 25</option>
              <option value="25-30">25 to 30</option>
              <option value="30+">More than 30</option>
            </select>
            {errors.age_group && <span className="error">{errors.age_group}</span>}

            <select
              className="input-field"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              required
            >
              <option value="">Select Designation</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="developer">Developer</option>
              <option value="business-owner">Business Owner</option>
              <option value="other">Other</option>
            </select>
            {errors.designation && <span className="error">{errors.designation}</span>}

            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}

            <button type="submit" className="create-btn">
              CREATE ACCOUNT
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="login-link"
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline"
              }}
            >
              Log In
            </span>
          </p>

          <p className="terms-text">
            <a href="#">Terms & Conditions and Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BotCraftSignup;
