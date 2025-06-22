import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "./assets/logo.png"; // adjust path as needed
import "./BotDashboard.css"; // your existing CSS

const BotDashboard = () => {
  const [bots, setBots] = useState([]);
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [selectedUrlBotId, setSelectedUrlBotId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/get_my_chatbots", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBots(response.data.chatbots);
      } catch (error) {
        console.error("Failed to fetch chatbots:", error);
      }
    };

    fetchBots();
  }, []);

  const handleChatClick = (bot) => {
    if (bot.input_type === "pdf") {
      navigate(`/pdf?bot_id=${bot.bot_id}`);
    } else if (bot.input_type === "website") {
      setSelectedUrlBotId(bot.bot_id);
      setShowUrlPopup(true);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logoss">
            <img src={Logo} alt="Logo" className="logos" />
            <span>BotCraft</span>
          </div>
          <div className="nav-button">My bots</div>
          <div className="nav-button" onClick={() => navigate("/")}>Home</div>
        </div>
        <div className="nav-button profile" onClick={() => navigate("/profile")}>
          <div className="profile-icon"></div>
          <span>Profile</span>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="bot-grid">
          {bots.map((bot, index) => (
            <div className="bot-card" key={index}>
              <div className="bot-avatar" />
              <div className="bot-name">{bot.chatbot_name}</div>
              <div className="bot-updated">Created: {new Date(bot.created_at).toLocaleDateString()}</div>
              <button
                className="edit-button"
                onClick={() => handleChatClick(bot)}
              >
                Chat
              </button>
              <div className="delete-icon">🗑️</div>
            </div>
          ))}

          {/* Create New Bot Card */}
          <div className="bot-card create-new" onClick={() => navigate("/createbot")}>
            <div className="create-text">Create new bot</div>
            <div className="create-icon">➕</div>
          </div>
        </div>
      </main>

      {/* Popup Modal for URL Bots */}
      {showUrlPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Choose an Option</h3>
            <button
              onClick={() => {
                setShowUrlPopup(false);
                navigate(`/pdf?bot_id=${selectedUrlBotId}`);
              }}
            >
              Chat
            </button>
            <button
              onClick={() => {
                setShowUrlPopup(false);
                navigate(`/url?bot_id=${selectedUrlBotId}`);
              }}
            >
              Get Embed Code
            </button>
            <button
              className="popup-close"
              onClick={() => setShowUrlPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotDashboard;














