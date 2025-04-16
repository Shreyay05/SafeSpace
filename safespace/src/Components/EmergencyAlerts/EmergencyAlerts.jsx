import React, { useState, useEffect } from 'react';
import './EmergencyAlerts.css';
import background from '../Assets/background.png';
import axios from 'axios';

const EmergencyAlert = ({ onNavigate, userData }) => {
  const [emergencyHelplines, setEmergencyHelplines] = useState([]);
  const [stateHospital, setStateHospital] = useState(null);
  const [userEmergencyContacts, setUserEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    contact_name: '',
    relation: '',
    contact_number: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Fetch emergency helplines and state hospital data
    const fetchData = async () => {
      try {
        setLoading(true);
        const helplinesResponse = await axios.get('http://localhost:3001/api/emergency-helplines');
        setEmergencyHelplines(helplinesResponse.data.emergency_helplines);
        
        // Only fetch state hospital if user has a location
        if (userData && userData.location) {
          try {
            const stateResponse = await axios.get(`http://localhost:3001/api/state-hospitals/${userData.location}`);
            setStateHospital(stateResponse.data.state_hospital);
          } catch (stateErr) {
            console.error('Error fetching state hospital data:', stateErr);
            // Don't set error state for this, just log the error
          }
        }
        
        // Fetch user's emergency contacts if user is logged in
        if (userData && userData.userid) {
          try {
            const emergencyContactsResponse = await axios.get(`http://localhost:3001/api/emergency-contacts/${userData.userid}`);
            setUserEmergencyContacts(emergencyContactsResponse.data.contacts);
          } catch (contactsErr) {
            console.error('Error fetching emergency contacts:', contactsErr);
            // Don't set error state for this, just log the error
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching emergency data:', err);
        setError('Failed to load emergency contacts. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const handleContact = (title, contact) => {
    alert(`Contacting ${title} at ${contact}`);
  };

  const handleEmailContact = (title, email) => {
    alert(`Opening ${title} website: ${email}`);
    // In a real application, you would redirect to the website
    // window.open(email.startsWith('http') ? email : `http://${email}`, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!newContact.contact_name.trim()) {
      setFormError('Contact name is required');
      return false;
    }
    if (!newContact.relation.trim()) {
      setFormError('Relation is required');
      return false;
    }
    if (!newContact.contact_number.trim()) {
      setFormError('Contact number is required');
      return false;
    }
    // Basic phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(newContact.contact_number.replace(/[\s-]/g, ''))) {
      setFormError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3001/api/emergency-contacts', {
        userid: userData.userid,
        name: userData.name, // The user's name
        contact_name: newContact.contact_name,
        relation: newContact.relation,
        contact_number: newContact.contact_number
      });
      
      // Add the new contact to the state
      setUserEmergencyContacts([...userEmergencyContacts, response.data.contact]);
      setShowAddForm(false);
      setNewContact({
        contact_name: '',
        relation: '',
        contact_number: ''
      });
    } catch (err) {
      console.error('Error adding emergency contact:', err);
      setFormError(err.response?.data?.error || 'Failed to add emergency contact');
    }
  };

  return (
    <div
      className="emergency-alert-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="emergency-alert-box">
        <h2>Emergency Alert System 🚨</h2>

        <div className="scrollable-section">
          {loading ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p>Loading emergency contacts...</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <h3>Emergency Helplines</h3>
              {emergencyHelplines.map((item, index) => (
                <div key={index} className="contact-card">
                  <span>{item.contact_title}: {item.contact_number || item.email}</span>
                  <div className="button-group">
                    {item.contact_number && (
                      <button onClick={() => handleContact(item.contact_title, item.contact_number)}>
                        Call
                      </button>
                    )}
                    {item.email && (
                      <button onClick={() => handleEmailContact(item.contact_title, item.email)}>
                        Visit
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {stateHospital && (
                <>
                  <h3>Mental Health Hospital in {stateHospital.state}</h3>
                  <div className="contact-card hospital-card">
                    <div className="hospital-info">
                      <div className="hospital-name">{stateHospital.mental_hospital_name}</div>
                      <div className="hospital-contact">
                        {stateHospital.contact_number && (
                          <span>Phone: {stateHospital.contact_number}</span>
                        )}
                        {stateHospital.email && (
                          <span>Email: {stateHospital.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="button-group">
                      {stateHospital.contact_number && (
                        <button onClick={() => handleContact(stateHospital.mental_hospital_name, stateHospital.contact_number)}>
                          Call
                        </button>
                      )}
                      {stateHospital.email && (
                        <button onClick={() => handleEmailContact(stateHospital.mental_hospital_name, stateHospital.email)}>
                          Email
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="emergency-contacts-section">
                <div className="section-header">
                  <h3>Your Emergency Contacts</h3>
                  {!showAddForm && (
                    <button 
                      className="add-contact-button"
                      onClick={() => setShowAddForm(true)}
                    >
                      Add Contact
                    </button>
                  )}
                </div>
                
                {showAddForm && (
                  <div className="add-contact-form">
                    <h4>Add Emergency Contact</h4>
                    {formError && <p className="form-error">{formError}</p>}
                    <form onSubmit={handleAddContact}>
                      <div className="form-group">
                        <label htmlFor="contact_name">Contact Name</label>
                        <input
                          type="text"
                          id="contact_name"
                          name="contact_name"
                          value={newContact.contact_name}
                          onChange={handleInputChange}
                          placeholder="Enter contact name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="relation">Relation</label>
                        <input
                          type="text"
                          id="relation"
                          name="relation"
                          value={newContact.relation}
                          onChange={handleInputChange}
                          placeholder="Enter relation (e.g. Parent, Sibling)"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact_number">Contact Number</label>
                        <input
                          type="text"
                          id="contact_number"
                          name="contact_number"
                          value={newContact.contact_number}
                          onChange={handleInputChange}
                          placeholder="Enter contact number"
                        />
                      </div>
                      <div className="form-buttons">
                        <button type="submit" className="save-button">Save Contact</button>
                        <button 
                          type="button" 
                          className="cancel-button"
                          onClick={() => {
                            setShowAddForm(false);
                            setFormError('');
                            setNewContact({
                              contact_name: '',
                              relation: '',
                              contact_number: ''
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {userEmergencyContacts.length > 0 ? (
                  userEmergencyContacts.map((contact, index) => (
                    <div key={index} className="contact-card">
                      <div className="emergency-contact-info">
                        <div><strong>{contact.contact_name}</strong> ({contact.relation})</div>
                        <div>{contact.contact_number}</div>
                      </div>
                      <button onClick={() => handleContact(contact.contact_name, contact.contact_number)}>
                        Contact
                      </button>
                    </div>
                  ))
                ) : !showAddForm ? (
                  <div className="no-contacts-message">
                    <p>No emergency contacts found. Please add emergency contacts for emergency situations.</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <button className="back-button" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmergencyAlert;