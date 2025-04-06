import React, { useState } from 'react';
import './Dashboard.css';
import wallpaper from '../Assets/wallpaper.png'; // Ensure the path is correct
import chatbotIcon from '../Assets/chatbot.png';
import communityIcon from '../Assets/community.jpg';

const Dashboard = ({ onNavigate }) => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    
    const quotes = [
        "Healing takes time, and asking for help is a courageous step toward it.",
        "Your journey matters. Take each moment as it comes.",
        "Peace begins with patience and self-compassion.",
        "The path to wellness is not linear, but it is always worth taking."
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    
    return (
        <div
            className="dashboard-container"
            style={{
                backgroundImage: `url(${wallpaper})`
            }}
        >   
            {/* Community Posts Icon */}
            <div className="community-icon" onClick={() => onNavigate('community')}>
                <img src={communityIcon} alt="Community" />
            </div>
            
            {/* Chatbot Icon */}
            <div className="chatbot-icon" onClick={() => onNavigate('chatbot')}>
                <img src={chatbotIcon} alt="Chatbot" />
            </div>
            
            {/* Toggle Button */}
            <button 
                className="sidebar-toggle" 
                onClick={toggleSidebar}
            >
                {sidebarVisible ? '◀ Hide' : '▶ Show'}
            </button>
            
            {/* Sidebar - only render if visible */}
            {sidebarVisible && (
                <div className="sidebar">
                    <div className="sidebar-logo">
                        <img src="/favicon.ico" alt="Logo" className="sidebar-logo-img" />
                        <span>SafeSpace</span>
                    </div>
                    <ul className="sidebar-links">
                        <li onClick={() => alert("Home Clicked")}>Home <span className="nav-arrow">→</span></li>
                        <li onClick={() => onNavigate('feeling')}>How Are You Feeling <span className="nav-arrow">→</span></li>
                        <li onClick={() => onNavigate('booking')}>Book a Session <span className="nav-arrow">→</span></li>
                        <li onClick={() => onNavigate('profile')}>My Profile <span className="nav-arrow">→</span></li>
                        <li onClick={() => onNavigate('emergency')}>🚨 Emergency Alert <span className="nav-arrow">→</span></li>
                    </ul>
                </div>
            )}
            
            {/* Main content */}
            <div className={`main-content ${!sidebarVisible ? 'full-width' : ''}`}>
                {/* Logo */}
                <div className="dashboard-logo">
                    <img src="/favicon.ico" alt="SafeSpace Logo" className="logo-img" />
                    <div className="logo-text">
                        <p>SafeSpace</p>
                        <span>YOUR MIND MATTERS</span>
                    </div>
                </div>
                
                {/* Quote */}
                <div className="quote-container">
                    <p className="quote">
                        "{randomQuote}" <span className="flower-icon">🌼</span>
                    </p>
                </div>
                
                {/* Buttons */}
                <div className="action-buttons">
                    <button
                        className="feeling-btn" 
                        onClick={() => onNavigate('feeling')}
                    >
                    HOW ARE YOU FEELING TODAY? →
                    </button>
                    <button 
                        className="session-btn" 
                        onClick={() => onNavigate('booking')}
                    >
                        BOOK A SESSION NOW →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;