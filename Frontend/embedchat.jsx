



import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./embedchat.css"; // Import external CSS

const EmbedChat = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const botId = queryParams.get("bot_id");

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: "user", text: userInput };
    const thinkingMessage = { type: "bot", text: "Thinking..." };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setUserInput("");
    setIsThinking(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_id: botId,
          question: userInput,
          language: language,
        }),
      });

      const data = await response.json();
      const botReply = data.answer || data.error || "No response.";

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // Remove "Thinking..."
        return [...updated, { type: "bot", text: botReply }];
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // Remove "Thinking..."
        return [...updated, { type: "bot", text: "❌ Error contacting chatbot API." }];
      });
    }

    setIsThinking(false);
  };

  return (
    <div className="chat-container">
      <div className="language-select">
        <label>
          <input
            type="radio"
            value="en"
            checked={language === "en"}
            onChange={() => setLanguage("en")}
          />
          English
        </label>
        <label>
          <input
            type="radio"
            value="ur"
            checked={language === "ur"}
            onChange={() => setLanguage("ur")}
          />
          اردو
        </label>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.type === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default EmbedChat;
