import React, { useState } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';
import Booking from './Components/Booking/Booking';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <>
      {currentPage === 'login' && <LoginSignup onNavigate={() => handleNavigation('dashboard')} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={() => handleNavigation('booking')} />}
      {currentPage === 'booking' && <Booking onNavigate={(page) => handleNavigation(page)} />}
    </>
  );
}

export default App;