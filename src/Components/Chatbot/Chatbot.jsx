import React from 'react';
import './Chatbot.css';

const Chatbot = ({ onNavigate }) => {
  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">Talk to our AI Chatbot 🤖</h2>
      
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/wgP5P2TQWc0fngNy1VmhL"
        title="Mental Health Chatbot"
        className="chatbot-frame"
        allow="clipboard-write; encrypted-media;"
      ></iframe>

      {/* Floating Back Button */}
      <button className="chatbot-back-button" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default Chatbot;



