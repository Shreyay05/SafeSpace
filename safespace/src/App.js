//import logo from './logo.svg';
import React, { useState } from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  return (
    <>
    {currentPage === 'login' && <LoginSignup onNavigate={() => setCurrentPage('dashboard')} />}
    {currentPage === 'dashboard' && <Dashboard onNavigate={() => setCurrentPage('login')} />}
    </>
  )
}

export default App;