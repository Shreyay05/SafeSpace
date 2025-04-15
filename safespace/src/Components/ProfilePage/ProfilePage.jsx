import React from 'react';
import './ProfilePage.css';
import backgroundImage from '../Assets/background.png';

const ProfilePage = ({ userData, onNavigate, onLogout }) => {
  // Function to format date (remove time component)
  const formatDateOnly = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="profile-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="profile-card">
        <h2>👤 My Profile</h2>
        
        <div className="profile-info">
          <p><strong>User ID:</strong> {userData.userid}</p>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Date of Birth:</strong> {formatDateOnly(userData.dob)}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Contact Number:</strong> +91 {userData.contactNumber}</p>
          <p><strong>Location:</strong> {userData.location}</p>
          
          <div className="button-group">
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>

      <button className="bottom-dashboard-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default ProfilePage;