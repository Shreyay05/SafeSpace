import React, { useState, useEffect } from 'react';
import './Booking.css';
import axios from 'axios';

const Booking = ({ onNavigate, userData }) => {
    const [therapists, setTherapists] = useState([]);
    const [filteredTherapists, setFilteredTherapists] = useState([]);
    const [nameSearchTerm, setNameSearchTerm] = useState('');
    const [specializationSearchTerm, setSpecializationSearchTerm] = useState('');
    const [selectedTherapist, setSelectedTherapist] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [localUserData, setLocalUserData] = useState(userData);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    
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
                setError(null); // Clear any previous errors
                
                console.log('Fetching therapists...');
                const response = await axios.get('http://localhost:3001/api/therapists');
                console.log('Therapists response:', response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    // Transform the data to match your UI structure with correct field names
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
                    setFilteredTherapists(formattedTherapists);
                } else {
                    console.error('Invalid data format received:', response.data);
                    setError('Received invalid data format from server');
                }
                
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching therapists:', err);
                setError(`Failed to load therapists: ${err.message || 'Unknown error'}`);
                setIsLoading(false);
            }
        };
        
        fetchTherapists();
    }, []);
    
    // Filter therapists based on search terms
    useEffect(() => {
        let filtered = [...therapists];
        
        // Filter by name if there's a name search term
        if (nameSearchTerm.trim()) {
            const lowercasedNameSearch = nameSearchTerm.toLowerCase();
            filtered = filtered.filter(therapist => 
                therapist.name.toLowerCase().includes(lowercasedNameSearch)
            );
        }
        
        // Filter by specialization if there's a specialization search term
        if (specializationSearchTerm.trim()) {
            const lowercasedSpecializationSearch = specializationSearchTerm.toLowerCase();
            filtered = filtered.filter(therapist => 
                therapist.specialty.toLowerCase().includes(lowercasedSpecializationSearch)
            );
        }
        
        setFilteredTherapists(filtered);
    }, [nameSearchTerm, specializationSearchTerm, therapists]);
    
    // Handle search input changes
    const handleNameSearchChange = (e) => {
        setNameSearchTerm(e.target.value);
    };
    
    const handleSpecializationSearchChange = (e) => {
        setSpecializationSearchTerm(e.target.value);
    };
    
    const clearNameSearch = () => {
        setNameSearchTerm('');
    };
    
    const clearSpecializationSearch = () => {
        setSpecializationSearchTerm('');
    };
    
    const clearAllSearches = () => {
        setNameSearchTerm('');
        setSpecializationSearchTerm('');
    };
    
    // Calendar helper functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };
    
    // Generate calendar days for the current month
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        
        // Create blank spaces for days before the first day of the month
        const days = Array(firstDayOfMonth).fill(null);
        
        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            // Disable past dates and weekends
            const isDisabled = date < new Date().setHours(0, 0, 0, 0) || 
                               date.getDay() === 0 || 
                               date.getDay() === 6;
            
            days.push({
                day: i,
                date: date,
                isDisabled: isDisabled
            });
        }
        
        return days;
    };
    
    const fetchAvailableTimeSlots = async (date, therapistId) => {
        if (!date || !therapistId) return [];
        
        try {
          // Format date as YYYY-MM-DD for the API
          const formattedDate = date.toISOString().split('T')[0];
          const response = await axios.get(`http://localhost:3001/api/availability/${therapistId}/${formattedDate}`);
          
          if (response.data && Array.isArray(response.data)) {
            return response.data;
          } else {
            console.error('Invalid time slots format received');
            return [];
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
          setError('Failed to load available time slots');
          return [];
        }
      };
      
    
    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() - 1);
            return newMonth;
        });
    };
    
    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + 1);
            return newMonth;
        });
    };
    
    // Update the handleDateSelect function in Booking.jsx
const handleDateSelect = async (day) => {
    if (day && !day.isDisabled) {
      setSelectedDate(day.date);
      setSelectedTimeSlot(null);
      
      // Show loading state
      setIsLoading(true);
      
      // Fetch real availability for the selected therapist and date
      if (selectedTherapist) {
        const slots = await fetchAvailableTimeSlots(day.date, selectedTherapist.id);
        setAvailableTimeSlots(slots);
      }
      
      setIsLoading(false);
    }
  };
  
    // Update the handleTherapistSelect function in Booking.jsx
const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setAvailableTimeSlots([]);
  };
  
  
    
    const handleTimeSlotSelect = (slot) => {
        if (slot.disabled) return;
        
        setSelectedTimeSlot({
            time: slot.time,
            slotId: slot.slotId
        });
    };
    
    // Update the handleConfirmBooking function to handle conflict errors
const handleConfirmBooking = async () => {
    if (!localUserData) {
      setError('Please log in to book a session.');
      return;
    }
    
    if (!selectedTherapist || !selectedDate || !selectedTimeSlot) {
      setError('Please select a therapist, date, and time slot.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Format the appointment date for display
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Extract the hour from the time slot
      const hour = parseInt(selectedTimeSlot.time.split(':')[0]);
      const isPM = selectedTimeSlot.time.includes('PM');
      const hour24 = hour === 12 ? 
        (isPM ? 12 : 0) : 
        (isPM ? hour + 12 : hour);
      
      // Create appointment datetime
      const appointmentDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hour24,
        0,
        0
      ).toISOString();
      
      // Make the API call to book the appointment
      const response = await axios.post('http://localhost:3001/api/appointments', {
        userid: localUserData.userid,
        therapistid: selectedTherapist.id,
        appointment_time: appointmentDateTime
      });
      
      console.log("Booking response:", response.data);
      
      setBookingDetails({
        therapist: selectedTherapist,
        date: formattedDate,
        time: selectedTimeSlot.time,
        bookingId: response.data.appointmentId
      });
      
      setIsLoading(false);
      setIsConfirmed(true);
    } catch (err) {
      console.error('Error booking appointment:', err);
      
      // Handle the conflict error specifically
      if (err.response?.status === 409) {
        setError(err.response.data.error);
        
        // Refresh the time slots to show updated availability
        if (selectedDate && selectedTherapist) {
          const updatedSlots = await fetchAvailableTimeSlots(selectedDate, selectedTherapist.id);
          setAvailableTimeSlots(updatedSlots);
        }
      } else {
        const errorMessage = err.response?.data?.error || 'Failed to book appointment. Please try again.';
        setError(errorMessage);
      }
      
      setIsLoading(false);
    }
  };
    const handleBackToDashboard = () => {
        onNavigate('dashboard');
    };
    
    const handleNewBooking = () => {
        setSelectedTherapist(null);
        setSelectedDate(null);
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
            <div className="booking-container-full">
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
            <div className="booking-container-full">
                <div className="booking-content">
                    <div className="booking-header">
                        <h1 className="booking-title">Book a Therapy Session</h1>
                        <div className="navigation-buttons">
                            <button className="back-btn" onClick={handleBackToDashboard}>
                                Back to Dashboard
                            </button>
                            <button className="back-btn" onClick={handleNewBooking}>
                                Book Another Session
                            </button>
                        </div>
                    </div>
                    
                    <div className="confirmation-message">
                        <h2>🎉 Booking Confirmed!</h2>
                        <p>Your therapy session has been successfully scheduled.</p>
                        
                        <div className="confirmation-details">
                            <p><strong>Therapist:</strong> {bookingDetails.therapist.name}</p>
                            <p><strong>Date:</strong> {bookingDetails.date}</p>
                            <p><strong>Time:</strong> {bookingDetails.time}</p>
                            {bookingDetails.bookingId && (
                                <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
                            )}
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
        <div className="booking-container-full">
            {/* Main content */}
            <div className="booking-content">
                <div className="booking-header">
                    <h1 className="booking-title">Book a Therapy Session</h1>
                    <p className="booking-subtitle">Choose a therapist and a time slot that works for you.</p>
                    <button className="back-btn header-btn" onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </button>
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
                
                {/* Therapist search and selection */}
                <h2>Select a Therapist</h2>
                
                {/* Dual Search Bars */}
                <div className="search-container">
                    <div className="search-row">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                className="therapist-search-input"
                                placeholder="Search by therapist name..."
                                value={nameSearchTerm}
                                onChange={handleNameSearchChange}
                            />
                            {nameSearchTerm && (
                                <button className="search-clear-btn" onClick={clearNameSearch}>
                                    ✕
                                </button>
                            )}
                        </div>
                        
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                className="therapist-search-input"
                                placeholder="Search by specialization..."
                                value={specializationSearchTerm}
                                onChange={handleSpecializationSearchChange}
                            />
                            {specializationSearchTerm && (
                                <button className="search-clear-btn" onClick={clearSpecializationSearch}>
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="therapists-container">
                    {filteredTherapists.length === 0 ? (
                        <div className="no-results-message">
                            <p>No therapists found matching your search criteria.</p>
                            <button className="clear-search-btn" onClick={clearAllSearches}>
                                Clear All Searches
                            </button>
                        </div>
                    ) : (
                        filteredTherapists.map(therapist => (
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
                
                {/* Calendar and Time Slots */}
                {selectedTherapist && (
                    <>
                        <h2>Select Date & Time</h2>
                        <div className="calendar-section">
                            {/* Calendar */}
                            <div className="calendar-container">
                                <div className="calendar-header">
                                    <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                                        &lt;
                                    </button>
                                    <div className="calendar-title">
                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </div>
                                    <button className="calendar-nav-btn" onClick={goToNextMonth}>
                                        &gt;
                                    </button>
                                </div>
                                
                                <div className="calendar-weekdays">
                                    <div>Sun</div>
                                    <div>Mon</div>
                                    <div>Tue</div>
                                    <div>Wed</div>
                                    <div>Thu</div>
                                    <div>Fri</div>
                                    <div>Sat</div>
                                </div>
                                
                                <div className="calendar-days">
                                    {generateCalendarDays().map((day, index) => (
                                        <div 
                                            key={index}
                                            className={`calendar-day ${day === null ? 'empty' : ''} 
                                                      ${day && day.isDisabled ? 'disabled' : ''} 
                                                      ${day && selectedDate && day.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                                            onClick={() => day && handleDateSelect(day)}
                                        >
                                            {day && day.day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Time Slots */}
                            {selectedDate && (
                                <div className="time-slots-container">
                                    <h3>Available Times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                                    
                                    <div className="time-slots-grid">
                                        {availableTimeSlots.length === 0 ? (
                                            <p>No available time slots for this date.</p>
                                        ) : (
                                            availableTimeSlots.map((slot, index) => (
                                                <div 
                                                    key={index}
                                                    className={`time-slot ${slot.disabled ? 'disabled' : ''} 
                                                              ${selectedTimeSlot && selectedTimeSlot.slotId === slot.slotId ? 'selected' : ''}`}
                                                    onClick={() => handleTimeSlotSelect(slot)}
                                                >
                                                    {slot.time}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
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
                        disabled={!selectedTherapist || !selectedDate || !selectedTimeSlot || !localUserData}
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