import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLink, FaFilePdf, FaPaperPlane } from "react-icons/fa";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import "./CreateBot.css";
import axios from "axios";
import Popup from './popup.jsx'; // adjust path if needed


const CreateBot = () => {
  const [botName, setBotName] = useState("");
  const [selectedOption, setSelectedOption] = useState(""); // "url" or "pdf"
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [lastCreatedBotId, setLastCreatedBotId] = useState(null);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleCreateBot = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    if (!botName.trim()) {
      alert("Chatbot name is required.");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (selectedOption === "pdf") {
        if (!pdfFile) {
          alert("Please upload a PDF file.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("chatbot_name", botName);
        formData.append("pdf", pdfFile);

        response = await axios.post("http://localhost:5000/upload-pdf", formData, {
          headers: {
            Authorization: `Bearer ${token}`
            // Content-Type is set automatically for multipart/form-data
          }
        });
        alert("PDF uploaded successfully!");

        const botId = response.data.bot_id;
        navigate(`/pdf?bot_id=${botId}`);


      } else if (selectedOption === "url") {
        if (!url.trim()) {
          alert("Please enter a valid URL.");
          setLoading(false);
          return;
        }

        response = await axios.post(
          "http://localhost:5000/upload-url",
          {
            chatbot_name: botName,
            website_url: url
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const botId = response.data.bot_id;
        setLastCreatedBotId(botId);
        setShowPopup(true);

      } else {
        alert("Please select an input type (PDF or URL).");
      }

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="app-container">
      <div className="createbot-wrapper">
        <Navbar />

        <div className="botcraft-container">
          <div className="botcraft-content">
            <h2>
              Create your own chatbot with <span className="brand">BotCraft</span>
            </h2>

            {/* Step 1 */}
            <div className="step">
              <p className="step-number">Step 1 of 2</p>
              <h3>What would you like to name your bot?</h3>
              <p className="subtext">You can always change this later.</p>
              <input
                type="text"
                placeholder="Bot Name"
                className="input"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>

            {/* Step 2 */}
            <div className="step">
              <p className="step-number">Step 2 of 2</p>
              <h3>Provide Information to Train Your Bot</h3>
              <p className="subtext">
                Start by giving your bot a webpage or some files to kickstart your bot's learning. You can add more content later.
              </p>
              <p className="choose-text">Choose one of the following</p>

              <div className="option-buttons">
                <button
                  className={`option-btn ${selectedOption === "url" ? "selected" : ""}`}
                  onClick={() => handleOptionClick("url")}
                >
                  <FaLink size={28} />
                  <span>URL</span>
                </button>
                <button
                  className={`option-btn ${selectedOption === "pdf" ? "selected" : ""}`}
                  onClick={() => handleOptionClick("pdf")}
                >
                  <FaFilePdf size={28} />
                  <span>PDF</span>
                </button>
              </div>

              {selectedOption === "url" && (
                <>
                  <label className="company-label" htmlFor="company-website">
                    Enter your company website
                  </label>
                  <div className="input-with-icon">
                    <input
                      id="company-website"
                      type="text"
                      placeholder="Enter your company website"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <FaPaperPlane className="send-icon" onClick={handleCreateBot} />
                  </div>
                </>
              )}

              {selectedOption === "pdf" && (
                <>
                  <label className="company-label" htmlFor="pdf-upload">
                    Upload a PDF document
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    id="pdf-upload"
                  />
                  <button className="upload-btn" onClick={handleCreateBot} disabled={loading}>
                    {loading ? "Uploading..." : "Upload PDF & Create Bot"}
                  </button>
                </>
              )}
            </div>

            <button className="ccreate-btn" onClick={handleCreateBot} disabled={loading}>
              {loading ? "Creating Bot..." : "Create Bot"}
            </button>
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onOptionSelect={(option) => {
            if (option === "embed") {
              navigate(`/url?bot_id=${lastCreatedBotId}`);
            } else if (option === "chat") {
              navigate(`/pdf?bot_id=${lastCreatedBotId}`);
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default CreateBot;
