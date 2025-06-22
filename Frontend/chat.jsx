import React, { useState } from "react";
import axios from "axios";

const ChatbotInterface = () => {
    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const token = localStorage.getItem("token");

    const handleSend = async () => {
        if (!question.trim()) return;

        const userMessage = { sender: "user", text: question };
        setChatHistory((prev) => [...prev, userMessage]);

        try {
            const res = await axios.post(
                "http://localhost:5000/ask",
                { question },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const botMessage = { sender: "bot", text: res.data.answer };
            setChatHistory((prev) => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = { sender: "bot", text: "Failed to get response." };
            setChatHistory((prev) => [...prev, errorMessage]);
            console.error(err);
        }

        setQuestion("");
    };

    return (
        <div className="chatbot-container">
            <h2>Ask Your Bot</h2>
            <div className="chat-window">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={question}
                    placeholder="Ask something..."
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatbotInterface;
