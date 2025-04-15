import React, { useState, useEffect } from 'react';
import './Booking.css';
import axios from 'axios';

const Booking = ({ onNavigate, userData }) => {
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [localUserData, setLocalUserData] = useState(userData);
    
    // Ensure we have user data, either from props or localStorage
    useEffect(() => {
        if (!localUserData) {
            // Try to get user data from localStorage if not provided as prop
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                try {
                    const parsedData = JSON.parse(storedUserData);
                    setLocalUserData(parsedData);
                } catch (err) {
                    console.error('Error parsing stored user data:', err);
                }
            }
        }
    }, [localUserData]);
    
    // Fetch therapists on component mount
    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:3001/api/therapists');
                
                // Transform the data to match your UI structure
                const formattedTherapists = response.data.map(therapist => ({
                    id: therapist.therapistid,
                    name: therapist.Username || `Dr. ${therapist.therapistid.substring(0, 5)}`,
                    specialty: therapist.Specialization || 'General Therapy',
                    experience: therapist.YearsOfExperience ? `${therapist.YearsOfExperience} years` : 'Experienced',
                    initials: (therapist.Username || 'Dr').substring(0, 2).toUpperCase(),
                    bio: `Specializes in ${therapist.Specialization || 'various therapy techniques'}.`,
                    fee: therapist.consultation_fee || '100.00'
                }));
                
                setTherapists(formattedTherapists);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching therapists:', err);
                setError('Failed to load therapists. Please try again later.');
                setIsLoading(false);
            }
        };
        
        fetchTherapists();
    }, []);
    
    // Fetch available slots when a therapist is selected
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedTherapist) return;
            
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3001/api/time-slots/${selectedTherapist.id}`);
                setAvailableSlots(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching time slots:', err);
                setError('Failed to load available time slots. Please try again later.');
                setIsLoading(false);
            }
        };
        
        fetchAvailableSlots();
    }, [selectedTherapist]);
    
    // Function to group time slots by date for the calendar view
    const processTimeSlots = () => {
        // If no slots available, generate placeholder dates for the next 5 days
        if (!availableSlots || availableSlots.length === 0) {
            const currentDate = new Date();
            const weekdays = [];
            
            for (let i = 0; i < 5; i++) {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() + i);
                
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const dayMonth = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                
                weekdays.push({
                    day: dayName,
                    date: dayMonth,
                    slots: generateEmptyTimeSlots()
                });
            }
            
            return weekdays;
        }
        
        // Process actual slots from database
        const groupedSlots = {};
        
        availableSlots.forEach(slot => {
            const startDateTime = new Date(slot.start_time);
            const dateKey = startDateTime.toISOString().split('T')[0];
            const dayName = startDateTime.toLocaleDateString('en-US', { weekday: 'long' });
            const dayMonth = startDateTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            const time = startDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            
            if (!groupedSlots[dateKey]) {
                groupedSlots[dateKey] = {
                    day: dayName,
                    date: dayMonth,
                    slots: []
                };
            }
            
            groupedSlots[dateKey].slots.push({
                time: time,
                slotId: slot.slotid,
                disabled: false
            });
        });
        
        // Convert to array and sort by date
        return Object.values(groupedSlots).sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
    };
    
    // Generate empty time slots for UI when no real data is available
    const generateEmptyTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            const ampm = hour < 12 ? 'AM' : 'PM';
            const hour12 = hour <= 12 ? hour : hour - 12;
            const timeString = `${hour12}:00 ${ampm}`;
            slots.push({
                time: timeString,
                disabled: true
            });
        }
        return slots;
    };
    
    const weekdays = processTimeSlots();
    
    const handleTherapistSelect = (therapist) => {
        setSelectedTherapist(therapist);
        setSelectedTimeSlot(null);
    };
    
    const handleTimeSlotSelect = (day, time, slotId, isDisabled) => {
        if (isDisabled) return;
        
        setSelectedTimeSlot({
            day: day.day,
            date: day.date,
            time: time,
            slotId: slotId
        });
    };
    
    const handleConfirmBooking = async () => {
        console.log("User data at booking:", localUserData); // Debug line
        
        if (!localUserData) {
            setError('Please log in to book a session.');
            return;
        }
        
        if (!selectedTherapist || !selectedTimeSlot) {
            setError('Please select a therapist and a time slot.');
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null); // Clear any previous errors
            
            console.log("Booking data:", {
                userid: localUserData.userid,
                therapistid: selectedTherapist.id,
                slotid: selectedTimeSlot.slotId
            });
            
            const response = await axios.post('http://localhost:3001/api/appointments', {
                userid: localUserData.userid,
                therapistid: selectedTherapist.id,
                slotid: selectedTimeSlot.slotId
            });
            
            console.log("Booking response:", response.data);
            
            setBookingDetails({
                therapist: selectedTherapist,
                day: selectedTimeSlot.day,
                date: selectedTimeSlot.date,
                time: selectedTimeSlot.time
            });
            
            setIsLoading(false);
            setIsConfirmed(true);
        } catch (err) {
            console.error('Error booking appointment:', err);
            const errorMessage = err.response?.data?.error || 'Failed to book appointment. Please try again.';
            setError(errorMessage);
            console.log('Full error object:', err); // Full error logging
            setIsLoading(false);
        }
    };
    
    const handleBackToDashboard = () => {
        onNavigate('dashboard');
    };
    
    const handleNewBooking = () => {
        setSelectedTherapist(null);
        setSelectedTimeSlot(null);
        setIsConfirmed(false);
        setError(null);
    };
    
    const handleLogin = () => {
        onNavigate('login');
    };
    
    // Show loading indicator
    if (isLoading) {
        return (
            <div className="booking-container">
                <div className="booking-sidebar">
                    <div className="booking-sidebar-logo">
                        <img src="/favicon.ico" alt="Logo" className="booking-sidebar-logo-img" />
                        <span>SafeSpace</span>
                    </div>
                    <ul className="booking-sidebar-links">
                        <li onClick={handleBackToDashboard}>Home <span className="booking-nav-arrow">→</span></li>
                        <li>Book a Session <span className="booking-nav-arrow">→</span></li>
                        <li onClick={() => alert("Profile Clicked")}>My Profile <span className="booking-nav-arrow">→</span></li>
                    </ul>
                </div>
                <div className="booking-content loading">
                    <div className="loading-indicator">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    // Show confirmation screen
    if (isConfirmed && bookingDetails) {
        return (
            <div className="booking-container">
                <div className="booking-sidebar">
                    <div className="booking-sidebar-logo">
                        <img src="/favicon.ico" alt="Logo" className="booking-sidebar-logo-img" />
                        <span>SafeSpace</span>
                    </div>
                    <ul className="booking-sidebar-links">
                        <li onClick={handleBackToDashboard}>Home <span className="booking-nav-arrow">→</span></li>
                        <li onClick={handleNewBooking}>Book a Session <span className="booking-nav-arrow">→</span></li>
                        <li onClick={() => alert("Profile Clicked")}>My Profile <span className="booking-nav-arrow">→</span></li>
                    </ul>
                </div>
                
                <div className="booking-content">
                    <div className="confirmation-message">
                        <h2>🎉 Booking Confirmed!</h2>
                        <p>Your therapy session has been successfully scheduled.</p>
                        
                        <div className="confirmation-details">
                            <p><strong>Therapist:</strong> {bookingDetails.therapist.name}</p>
                            <p><strong>Date:</strong> {bookingDetails.date}</p>
                            <p><strong>Day:</strong> {bookingDetails.day}</p>
                            <p><strong>Time:</strong> {bookingDetails.time}</p>
                        </div>
                        
                        <button className="confirm-btn" onClick={handleNewBooking}>
                            Book Another Session
                        </button>
                        
                        <button className="back-btn" onClick={handleBackToDashboard} style={{ marginTop: '12px' }}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Main booking view
    return (
        <div className="booking-container">
            {/* Sidebar */}
            <div className="booking-sidebar">
                <div className="booking-sidebar-logo">
                    <img src="/favicon.ico" alt="Logo" className="booking-sidebar-logo-img" />
                    <span>SafeSpace</span>
                </div>
                <ul className="booking-sidebar-links">
                    <li onClick={handleBackToDashboard}>Home <span className="booking-nav-arrow">→</span></li>
                    <li onClick={handleNewBooking}>Book a Session <span className="booking-nav-arrow">→</span></li>
                    <li onClick={() => alert("Profile Clicked")}>My Profile <span className="booking-nav-arrow">→</span></li>
                </ul>
            </div>
            
            {/* Main content */}
            <div className="booking-content">
                <div className="booking-header">
                    <h1 className="booking-title">Book a Therapy Session</h1>
                    <p className="booking-subtitle">Choose a therapist and a time slot that works for you.</p>
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                {!localUserData && (
                    <div className="login-reminder">
                        <p>Please log in to book a therapy session.</p>
                        <button className="login-btn" onClick={handleLogin}>
                            Log In
                        </button>
                    </div>
                )}
                
                {/* Display user info if logged in */}
                {localUserData && (
                    <div className="user-info">
                        <p>Logged in as: <strong>{localUserData.name}</strong></p>
                    </div>
                )}
                
                {/* Therapist selection */}
                <h2>Select a Therapist</h2>
                <div className="therapists-container">
                    {therapists.length === 0 ? (
                        <p>No therapists available at the moment.</p>
                    ) : (
                        therapists.map(therapist => (
                            <div 
                                key={therapist.id}
                                className={`therapist-card ${selectedTherapist && selectedTherapist.id === therapist.id ? 'selected' : ''}`}
                                onClick={() => handleTherapistSelect(therapist)}
                            >
                                <div className="therapist-header">
                                    <div className="therapist-avatar">{therapist.initials}</div>
                                    <div className="therapist-info">
                                        <h3>{therapist.name}</h3>
                                        <p>{therapist.specialty}</p>
                                    </div>
                                </div>
                                <div className="therapist-details">
                                    <p><strong>Experience:</strong> {therapist.experience}</p>
                                    <p>{therapist.bio}</p>
                                    {therapist.fee && (
                                        <p><strong>Fee:</strong> ${therapist.fee}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Calendar */}
                {selectedTherapist && (
                    <>
                        <h2>Select Date & Time</h2>
                        <div className="calendar-container">
                            <div className="calendar-header">
                                <div className="calendar-title">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            
                            <div className="calendar-week">
                                {weekdays.length === 0 ? (
                                    <p>No available time slots for this therapist.</p>
                                ) : (
                                    weekdays.map((day, dayIndex) => (
                                        <div key={dayIndex} className="day-column">
                                            <div className="day-header">
                                                {day.day} <br/> {day.date}
                                            </div>
                                            
                                            {day.slots.map((slot, slotIndex) => (
                                                <div 
                                                    key={slotIndex}
                                                    className={`time-slot ${slot.disabled ? 'disabled' : ''} ${
                                                        selectedTimeSlot && 
                                                        selectedTimeSlot.day === day.day && 
                                                        selectedTimeSlot.time === slot.time ? 'selected' : ''
                                                    }`}
                                                    onClick={() => handleTimeSlotSelect(day, slot.time, slot.slotId, slot.disabled)}
                                                >
                                                    {slot.time}
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
                
                {/* Booking actions */}
                <div className="booking-actions">
                    <button className="back-btn" onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </button>
                    <button 
                        className="confirm-btn" 
                        disabled={!selectedTherapist || !selectedTimeSlot || !localUserData}
                        onClick={handleConfirmBooking}
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;