import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrescriptionPage.css';

function PrescriptionPage({ userData, onNavigate }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [therapistInfo, setTherapistInfo] = useState({});

  useEffect(() => {
    // Fetch user's prescriptions when component mounts
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/prescriptions/${userData.userid}`);
        setPrescriptions(response.data.prescriptions);
        
        // Get therapist info for each prescription
        const therapistIds = [...new Set(response.data.prescriptions.map(p => p.therapistid))];
        const therapistData = {};
        
        for (const id of therapistIds) {
          if (id) {
            try {
              const therapistResponse = await axios.get(`http://localhost:3001/api/therapist/${id}`);
              therapistData[id] = therapistResponse.data.therapist;
            } catch (err) {
              console.error(`Error fetching therapist ${id}:`, err);
              therapistData[id] = { Username: "Unknown Therapist", Specialization: "Unknown" };
            }
          }
        }
        
        setTherapistInfo(therapistData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load your prescriptions. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userData.userid]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="prescription-container">
      <header className="prescription-header">
        <button className="back-button" onClick={() => onNavigate('dashboard')}>
          &larr; Back to Dashboard
        </button>
        <h1>My Prescriptions & Health Records</h1>
        <p className="user-welcome">Hello, {userData.name}</p>
      </header>

      {loading ? (
        <div className="loading">Loading your prescription data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : prescriptions.length === 0 ? (
        <div className="empty-message">
          <p>You don't have any prescriptions or health records yet.</p>
          <p>After consulting with a therapist, your prescriptions and health records will appear here.</p>
          <button className="booking-button" onClick={() => onNavigate('booking')}>
            Book a Therapist Session
          </button>
        </div>
      ) : (
        <div className="prescriptions-list">
          {prescriptions.map((prescription) => (
            <div className="prescription-card" key={prescription.id}>
              <div className="prescription-header-card">
                <h3>Prescription #{prescription.id}</h3>
                {prescription.therapistid && therapistInfo[prescription.therapistid] && (
                  <p className="therapist-name">
                    By: {therapistInfo[prescription.therapistid].Username} 
                    {therapistInfo[prescription.therapistid].Specialization && 
                      ` (${therapistInfo[prescription.therapistid].Specialization})`
                    }
                  </p>
                )}
              </div>

              <div className="prescription-body">
                {prescription.medication && (
                  <div className="medication-section">
                    <h4>Medication</h4>
                    <p>{prescription.medication}</p>
                  </div>
                )}

                {prescription.Prescription && (
                  <div className="prescription-section">
                    <h4>Prescription Details</h4>
                    <div className="prescription-text">
                      {prescription.Prescription}
                    </div>
                  </div>
                )}

                {prescription.mental_analysis && (
                  <div className="analysis-section">
                    <h4>Mental Health Analysis</h4>
                    <div className="analysis-text">
                      {prescription.mental_analysis}
                    </div>
                  </div>
                )}

                {prescription.userhealthrecord && (
                  <div className="health-record-section">
                    <h4>Health Record</h4>
                    <div className="health-record-text">
                      {prescription.userhealthrecord}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrescriptionPage;