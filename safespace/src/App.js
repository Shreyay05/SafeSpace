// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';
import Booking from './Components/Booking/Booking';
import FeelingToday from './Components/FeelingToday/FeelingToday';
import Chatbot from './Components/Chatbot/Chatbot';
import CommunityPosts from './Components/CommunityPosts/CommunityPosts';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import EmergencyAlert from './Components/EmergencyAlerts/EmergencyAlerts';
import PrescriptionPage from './Components/PrescriptionPage/PrescriptionPage'; // Import PrescriptionPage

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        // Automatically navigate to dashboard if user data exists
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    setCurrentPage('login');
  };

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  return (
    <>
      {currentPage === 'login' && <LoginSignup onNavigate={handleNavigation} />}
      {currentPage === 'dashboard' && <Dashboard userData={userData} onNavigate={handleNavigation} onLogout={handleLogout} />}
      {currentPage === 'feeling' && <FeelingToday userData={userData} onNavigate={handleNavigation} />}
      {currentPage === 'booking' && <Booking userData={userData} onNavigate={handleNavigation} />}
      {currentPage === 'chatbot' && <Chatbot userData={userData} onNavigate={handleNavigation} />}
      {currentPage === 'community' && <CommunityPosts userData={userData} onNavigate={handleNavigation} />}
      {currentPage === 'profile' && <ProfilePage userData={userData} onNavigate={handleNavigation} updateUserData={updateUserData} onLogout={handleLogout} />}
      {currentPage === 'emergency' && <EmergencyAlert userData={userData} onNavigate={handleNavigation} />}
      {currentPage === 'prescriptions' && <PrescriptionPage userData={userData} onNavigate={handleNavigation} />}
    </>
  );
}

export default App;