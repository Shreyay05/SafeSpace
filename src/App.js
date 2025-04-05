import React, { useState } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';
import Booking from './Components/Booking/Booking';
import FeelingToday from './Components/FeelingToday/FeelingToday';
import Chatbot from './Components/Chatbot/Chatbot';
import CommunityPosts from './Components/CommunityPosts/CommunityPosts';


function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'login' && <LoginSignup onNavigate={() => handleNavigation('dashboard')} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigation} />}
      {currentPage === 'feeling' && <FeelingToday onNavigate={(page) => handleNavigation(page)} />}
      {currentPage === 'booking' && <Booking onNavigate={(page) => handleNavigation(page)} />}
      {currentPage === 'chatbot' && <Chatbot onNavigate={handleNavigation} />} 
      {currentPage === 'community' && <CommunityPosts onNavigate={handleNavigation} />}

    </>
  );
}

export default App;
