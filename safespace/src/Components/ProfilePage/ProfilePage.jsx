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

const ProfilePage = ({ userData, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber') {
      // Allow only digits after +91 and limit to 10
      if (/^\d{0,10}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // You can send updated formData to backend here later
  };

  return (
    <div className="profile-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="profile-card">
        <h2>👤 My Profile</h2>

        <p><strong>User ID:</strong> {formData.id}</p>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Role:</strong> {formData.role}</p>
        <p><strong>Date of Birth:</strong> {formData.dob}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>

        {isEditing ? (
          <>
            <div className="edit-group">
              <label>Email:</label>
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="edit-group">
              <label>Contact Number:</label>
              <span>+91</span>
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter 10-digit number"
              />
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

            <button className="save-btn" onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Contact Number:</strong> +91 {formData.contactNumber}</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>

      <button className="bottom-dashboard-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default ProfilePage;
