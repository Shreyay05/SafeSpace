import React, { useState } from 'react';
import './Booking.css';
import backgroundImage from '../Assets/background.png';

const Booking = ({ onNavigate }) => {
    const [selectedTherapist, setSelectedTherapist] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    // Sample therapist data
    const therapists = [
        {
            id: 1,
            name: "Dr. Alex Morgan",
            specialty: "Cognitive Behavioral Therapy",
            experience: "8 years",
            initials: "AM",
            bio: "Specializes in anxiety, depression, and stress management techniques."
        },
        {
            id: 2,
            name: "Dr. Jamie Taylor",
            specialty: "Trauma-Focused Therapy",
            experience: "12 years",
            initials: "JT",
            bio: "Expert in trauma recovery and PTSD treatment approaches."
        },
        {
            id: 3,
            name: "Dr. Sam Wilson",
            specialty: "Mindfulness & Meditation",
            experience: "6 years",
            initials: "SW",
            bio: "Focuses on mindfulness-based interventions and emotional regulation."
        }
    ];
    
    // Generate time slots from 9 AM to 5 PM
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            const timeString = `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`.replace('0 PM', '12 PM');
            slots.push({
                time: timeString,
                disabled: Math.random() < 0.3 // Randomly disable ~30% of slots
            });
        }
        return slots;
    };
    
    // Days of the week (Monday to Friday)
    const weekdays = [
        { day: "Monday", date: "April 6", slots: generateTimeSlots() },
        { day: "Tuesday", date: "April 7", slots: generateTimeSlots() },
        { day: "Wednesday", date: "April 8", slots: generateTimeSlots() },
        { day: "Thursday", date: "April 9", slots: generateTimeSlots() },
        { day: "Friday", date: "April 10", slots: generateTimeSlots() }
    ];
    
    const handleTherapistSelect = (therapist) => {
        setSelectedTherapist(therapist);
    };
    
    const handleTimeSlotSelect = (day, time, isDisabled) => {
        if (isDisabled) return;
        
        setSelectedTimeSlot({
            day: day.day,
            date: day.date,
            time: time
        });
    };
    
    const handleConfirmBooking = () => {
        setIsConfirmed(true);
    };
    
    const handleBackToDashboard = () => {
        onNavigate('dashboard');
    };
    
    const handleNewBooking = () => {
        setSelectedTherapist(null);
        setSelectedTimeSlot(null);
        setIsConfirmed(false);
    };
    
    if (isConfirmed) {
        return (
            <div className="booking-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="booking-sidebar">
                    <div className="booking-sidebar-logo">
                        <img src="/favicon.ico" alt="Logo" className="booking-sidebar-logo-img" />
                        <span>SafeSpace</span>
                    </div>
                    <ul className="booking-sidebar-links">
                        <li onClick={handleBackToDashboard}>Home <span className="booking-nav-arrow">→</span></li>
                        <li onClick={handleNewBooking}>Book a Session <span className="booking-nav-arrow">→</span></li>
                        <li onClick={() => onNavigate('profile')}>My Profile <span className="nav-arrow">→</span></li>
                    </ul>
                </div>
                
                <div className="booking-content">
                    <div className="confirmation-message">
                        <h2>🎉 Booking Confirmed!</h2>
                        <p>Your therapy session has been successfully scheduled.</p>
                        
                        <div className="confirmation-details">
                            <p><strong>Therapist:</strong> {selectedTherapist.name}</p>
                            <p><strong>Date:</strong> {selectedTimeSlot.date}</p>
                            <p><strong>Day:</strong> {selectedTimeSlot.day}</p>
                            <p><strong>Time:</strong> {selectedTimeSlot.time}</p>
                        </div>
                        
                        <button className="confirm-btn" onClick={handleNewBooking}>
                            Book Another Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
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
                    <li onClick={() => onNavigate('profile')}>My Profile <span className="booking-nav-arrow">→</span></li>

                </ul>
            </div>
            
            {/* Main content */}
            <div className="booking-content">
                <div className="booking-header">
                    <h1 className="booking-title">Book a Therapy Session</h1>
                    <p className="booking-subtitle">Choose a therapist and a time slot that works for you.</p>
                </div>
                
                {/* Therapist selection */}
                <h2>Select a Therapist</h2>
                <div className="therapists-container">
                    {therapists.map(therapist => (
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
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Calendar */}
                {selectedTherapist && (
                    <>
                        <h2>Select Date & Time</h2>
                        <div className="calendar-container">
                            <div className="calendar-header">
                                <div className="calendar-title">April 2025</div>
                            </div>
                            
                            <div className="calendar-week">
                                {weekdays.map((day, dayIndex) => (
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
                                                onClick={() => handleTimeSlotSelect(day, slot.time, slot.disabled)}
                                            >
                                                {slot.time}
                                            </div>
                                        ))}
                                    </div>
                                ))}
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
                        disabled={!selectedTherapist || !selectedTimeSlot}
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