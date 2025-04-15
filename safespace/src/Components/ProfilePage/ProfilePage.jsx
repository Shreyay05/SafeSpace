import React, { useState } from 'react';
import './ProfilePage.css';
import backgroundImage from '../Assets/background.png';

const statesOfIndia = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const ProfilePage = ({ userData, onNavigate, updateUserData, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber') {
      // Allow only digits and limit to 10
      if (/^\d{0,10}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userData.userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          contactNumber: formData.contactNumber,
          location: formData.location
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      // Update user data in parent component and localStorage
      updateUserData(data.user);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="profile-card">
        <h2>👤 My Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {isLoading && <div className="loading-message">Updating profile...</div>}

        <div className="profile-info">
          <p><strong>User ID:</strong> {formData.userid}</p>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Role:</strong> {formData.role}</p>
          <p><strong>Date of Birth:</strong> {formData.dob}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>

          {isEditing ? (
            <>
              <div className="edit-group">
                <label>Email:</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  type="email"
                />
              </div>

              <div className="edit-group contact-group">
                <label>Contact Number:</label>
                <div className="phone-input">
                  <span className="country-code">+91</span>
                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    type="tel"
                  />
                </div>
              </div>

              <div className="edit-group">
                <label>Location:</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {statesOfIndia.map((state, idx) => (
                    <option key={idx} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="button-group">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(userData);
                    setError('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Contact Number:</strong> +91 {formData.contactNumber}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <div className="button-group">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>

      <button className="bottom-dashboard-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default ProfilePage;