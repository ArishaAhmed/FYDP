import React from 'react';
import './popup.css';

function Popup({ onClose, onOptionSelect }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Choose an Option</h2>
        <button className="popup-btn" onClick={() => onOptionSelect("chat")}>
          Continue Chat with Bot
        </button>
        <button className="popup-btn" onClick={() => onOptionSelect("embed")}>
          Generate Embedding Code
        </button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
