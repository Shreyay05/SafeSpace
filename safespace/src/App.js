// App.js
import React, { useState } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';
import Booking from './Components/Booking/Booking';
import FeelingToday from './Components/FeelingToday/FeelingToday';
import Chatbot from './Components/Chatbot/Chatbot';
import CommunityPosts from './Components/CommunityPosts/CommunityPosts';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import EmergencyAlert from './Components/EmergencyAlerts/EmergencyAlerts';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  // 🔧 TEMP: Mock user data — you can replace this with real data later
  const [userData] = useState({
    id: 'U001',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    role: 'User',
    dob: '1998-07-21',
    gender: 'Male',
    contactNumber: '9876543210',
    location: 'Karnataka'
  });

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'login' && <LoginSignup onNavigate={() => handleNavigation('dashboard')} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigation} />}
      {currentPage === 'feeling' && <FeelingToday onNavigate={handleNavigation} />}
      {currentPage === 'booking' && <Booking onNavigate={handleNavigation} />}
      {currentPage === 'chatbot' && <Chatbot onNavigate={handleNavigation} />}
      {currentPage === 'community' && <CommunityPosts onNavigate={handleNavigation} />}
      {currentPage === 'profile' && <ProfilePage userData={userData} onNavigate={handleNavigation} />}
      {currentPage === 'emergency' && <EmergencyAlert onNavigate={handleNavigation} userData={{ location: 'Karnataka' }} />}

    </>
  );
}

export default App;
