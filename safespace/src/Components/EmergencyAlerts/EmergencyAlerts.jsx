import React from 'react';
import './EmergencyAlerts.css';
import background from '../Assets/background.png';

const EmergencyAlert = ({ onNavigate }) => {
  const genericHelplines = [
    { name: "India National Helpline", contact: "112" },
    { name: "Mental Health Helpline", contact: "08046110007" },
    { name: "Women Helpline", contact: "1091" },
  ];

  const userEmergencyContact = {
    name: "My Emergency Contact",
    contact: "+91 9876543210",
  };

  const mentalHospitalContact = {
    state: "Karnataka",
    hospital: "NIMHANS",
    contact: "080-26995000",
  };

  const handleContact = (name, contact) => {
    alert(`Contacting ${name} at ${contact}`);
  };

  return (
    <div
      className="emergency-alert-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="emergency-alert-box">
        <h2>Emergency Alert System 🚨</h2>

        <div className="scrollable-section">
          <h3>Generic Helplines</h3>
          {genericHelplines.map((item, index) => (
            <div key={index} className="contact-card">
              <span>{item.name}: {item.contact}</span>
              <button onClick={() => handleContact(item.name, item.contact)}>Contact</button>
            </div>
          ))}

          <h3>Your Emergency Contact</h3>
          <div className="contact-card">
            <span>{userEmergencyContact.name}: {userEmergencyContact.contact}</span>
            <button onClick={() => handleContact(userEmergencyContact.name, userEmergencyContact.contact)}>Contact</button>
          </div>

         
        </div>

        <button className="back-button" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmergencyAlert;
