import React, { useState, useEffect } from 'react';
import './FeelingToday.css';
import moodData from './moods';
import backgroundImage from '../Assets/background.png';
import confetti from 'canvas-confetti';

const activities = {
  Excited: [
    'Channel your energy into a creative project 🎨',
    'Call a friend and share your excitement 📞',
    'Go for a walk or dance it out 🕺',
  ],
  Confident: [
    "Tackle a task you've been putting off ✅",
    "Write down things you're proud of ✍️",
    "Help someone else—it'll boost both your confidence 💪",
  ],
  Happy: [
    'Spread the joy—text someone you love 💬',
    'Listen to your favorite song 🎵',
    'Write in a gratitude journal 📓',
  ],
  Calm: [
    'Do a short meditation 🧘‍♀️',
    'Enjoy a hot drink or cozy activity ☕',
    'Read or watch something light and comforting 📖',
  ],
  Sad: [
    'Watch or listen to something that uplifts you 🎬',
    'Write down your feelings ✍️',
    'Reach out to someone you trust 🤝',
  ],
  Tired: [
    'Take a short nap or rest your eyes 💤',
    'Drink some water or have a snack 🥤',
    'Stretch or do light yoga 🧘‍♂️',
  ],
  Lonely: [
    'Call or message someone close 📱',
    'Visit a favorite spot or go outside 🌳',
    'Do something that brings you joy 🎨',
  ],
  Annoyed: [
    'Take deep breaths or go for a walk 🌬️',
    'Vent by journaling or drawing ✍️',
    'Distract yourself with a hobby 🎮',
  ],
  Stressed: [
    'Try a breathing exercise 🧘‍♀️',
    'Make a to-do list 🗒️',
    'Watch something funny 😂',
  ],
  Angry: [
    'Step away and take a break 🛑',
    "Write a letter you don't send ✍️",
    'Use physical energy—jump, punch a pillow, etc. 🥊',
  ],
};

// Define negative moods
const negativeMoods = ['Sad', 'Tired', 'Lonely', 'Annoyed', 'Stressed', 'Angry'];

// Define reasons for each negative mood
const moodReasons = {
  Sad: [
    'Loss of a loved one',
    'End of a relationship',
    'Professional setback',
    'Feeling isolated',
    'Health concerns',
    'Financial worries'
  ],
  Tired: [
    'Work overload',
    'Sleep difficulties',
    'Chronic health issues',
    'Mental exhaustion',
    'Caregiver burnout',
    'Poor work-life balance'
  ],
  Lonely: [
    'Recent move to new location',
    'Social isolation',
    'Difficulty connecting with others',
    'Loss of important relationships',
    'Working remotely',
    'Cultural or language barriers'
  ],
  Annoyed: [
    'Workplace conflicts',
    'Interpersonal issues',
    'Feeling undervalued',
    'Unfair treatment',
    'Communication problems',
    'Recurring frustrations'
  ],
  Stressed: [
    'Work deadlines',
    'Major life changes',
    'Financial pressure',
    'Relationship difficulties',
    'Health concerns',
    'Overwhelming responsibilities'
  ],
  Angry: [
    'Perceived injustice',
    'Betrayal of trust',
    'Unmet expectations',
    'Boundary violations',
    'Recurring conflicts',
    'Feeling powerless'
  ]
};

// Define recommended specialists for each reason
const specialistRecommendations = {
  'Loss of a loved one': 'Grief Counseling',
  'End of a relationship': 'Trauma Therapy',
  'Professional setback': 'Cognitive Behavioral Therapy',
  'Feeling isolated': 'Family Counseling',
  'Health concerns': 'Cognitive Behavioral Therapy',
  'Financial worries': 'Cognitive Behavioral Therapy',
  
  'Work overload': 'Cognitive Behavioral Therapy',
  'Sleep difficulties': 'Cognitive Behavioral Therapy',
  'Chronic health issues': 'Cognitive Behavioral Therapy',
  'Mental exhaustion': 'Psychoanalysis',
  'Caregiver burnout': 'Family Counseling',
  'Poor work-life balance': 'Cognitive Behavioral Therapy',
  
  'Recent move to new location': 'Family Counseling',
  'Social isolation': 'Family Counseling',
  'Difficulty connecting with others': 'Art Therapy',
  'Loss of important relationships': 'Trauma Therapy',
  'Working remotely': 'Cognitive Behavioral Therapy',
  'Cultural or language barriers': 'Family Counseling',
  
  'Workplace conflicts': 'Cognitive Behavioral Therapy',
  'Interpersonal issues': 'Couples Therapy',
  'Feeling undervalued': 'Cognitive Behavioral Therapy',
  'Unfair treatment': 'Trauma Therapy',
  'Communication problems': 'Couples Therapy',
  'Recurring frustrations': 'Cognitive Behavioral Therapy',
  
  'Work deadlines': 'Cognitive Behavioral Therapy',
  'Major life changes': 'Trauma Therapy',
  'Financial pressure': 'Cognitive Behavioral Therapy',
  'Relationship difficulties': 'Couples Therapy',
  'Health concerns': 'Cognitive Behavioral Therapy',
  'Overwhelming responsibilities': 'Family Counseling',
  
  'Perceived injustice': 'Trauma Therapy',
  'Betrayal of trust': 'Trauma Therapy',
  'Unmet expectations': 'Cognitive Behavioral Therapy',
  'Boundary violations': 'Trauma Therapy',
  'Recurring conflicts': 'Couples Therapy',
  'Feeling powerless': 'Trauma Therapy'
};

// List of all available specialists
const specialists = [
  'Family Counseling',
  'Couples Therapy',
  'Art Therapy',
  'Addiction Counseling',
  'Child Therapy',
  'Cognitive Behavioral Therapy',
  'Trauma Therapy',
  'Psychoanalysis',
  'Grief Counseling'
];

const FeelingToday = ({ onNavigate }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [intensityLevel, setIntensityLevel] = useState(null);
  const [showIntensityScale, setShowIntensityScale] = useState(false);
  const [feelingBetter, setFeelingBetter] = useState(null);
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [recommendedSpecialist, setRecommendedSpecialist] = useState(null);
  const [showSpecialists, setShowSpecialists] = useState(false);

  const isNegativeMood = selectedMood && negativeMoods.includes(selectedMood);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setCompletedTasks([]);
    setAllTasksCompleted(false);
    setIntensityLevel(null);
    setFeelingBetter(null);
    setShowReasons(false);
    setSelectedReason(null);
    setRecommendedSpecialist(null);
    setShowSpecialists(false);
    
    // Show intensity scale only for negative moods
    if (negativeMoods.includes(mood)) {
      setShowIntensityScale(true);
    } else {
      setShowIntensityScale(false);
    }
  };

  const handleIntensitySelect = (level) => {
    setIntensityLevel(level);
    setShowIntensityScale(false);
  };

  const handleCheckboxChange = (task) => {
    let newCompletedTasks;
    if (completedTasks.includes(task)) {
      newCompletedTasks = completedTasks.filter((t) => t !== task);
    } else {
      newCompletedTasks = [...completedTasks, task];
    }
    setCompletedTasks(newCompletedTasks);

    if (newCompletedTasks.length === activities[selectedMood].length) {
      setAllTasksCompleted(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      // For negative moods with high intensity, ask if they feel better
      if (isNegativeMood && intensityLevel > 5) {
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 500);
      }
    }
  };

  const handleFeelingBetterResponse = (response) => {
    setFeelingBetter(response);
    if (!response) {
      setShowReasons(true);
    }
  };

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    const specialist = specialistRecommendations[reason];
    setRecommendedSpecialist(specialist);
    setShowSpecialists(true);
    setShowReasons(false);
  };

  const handleBookAppointment = () => {
    // Navigate to the booking page
    onNavigate('booking');
  };

  return (
    <div
      className="feeling-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >

      {!selectedMood ? (
        // Initial mood selection screen
        <>
          <h1 className="feeling-title">How are you feeling today?</h1>
          <div className="mood-grid">
            {moodData.map((mood) => (
              <div key={mood.name} className="mood-card" onClick={() => handleMoodSelect(mood.name)}>
                <img src={mood.image} alt={mood.name} className="mood-image" />
                <p className="mood-name">{mood.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : showIntensityScale ? (
        // Intensity scale screen for negative moods
        <div className="selected-section">
          <h2>You're feeling {selectedMood} 💬</h2>
          <p>How intense is this feeling on a scale of 1-10?</p>
          <div className="intensity-scale">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button 
                key={level} 
                className={`intensity-button`}
                onClick={() => handleIntensitySelect(level)}
              >
                {level}
              </button>
            ))}
          </div>
          <button className="back-button" onClick={() => setSelectedMood(null)}>
            Back to Moods
          </button>
        </div>
      ) : showReasons ? (
        // Reason selection screen
        <div className="selected-section">
          <h2>We're sorry you're feeling {selectedMood} 💬</h2>
          <p>What might be contributing to this feeling?</p>
          <div className="reasons-grid">
            {moodReasons[selectedMood].map((reason) => (
              <div 
                key={reason} 
                className="reason-card"
                onClick={() => handleReasonSelect(reason)}
              >
                <p>{reason}</p>
              </div>
            ))}
          </div>
          <button className="back-button" onClick={() => {
            setShowReasons(false);
            setFeelingBetter(null);
          }}>
            Back
          </button>
        </div>
      ) : showSpecialists ? (
        // Specialist recommendation screen
        <div className="selected-section">
          <h2>Professional Support</h2>
          <p>Based on your situation, we recommend speaking with a specialist in:</p>
          <div className="specialist-recommendation">
            <h3>{recommendedSpecialist}</h3>
            <p>This type of therapy can help address issues related to {selectedReason.toLowerCase()}.</p>
          </div>
          <div className="specialist-action">
            <button className="book-button" onClick={handleBookAppointment}>
              Book an Appointment
            </button>
          </div>
          <div className="other-specialists">
            <h4>Other specialists available:</h4>
            <div className="specialist-list">
              {specialists.filter(s => s !== recommendedSpecialist).map(specialist => (
                <span key={specialist} className="specialist-tag">{specialist}</span>
              ))}
            </div>
          </div>
          <button className="back-button" onClick={() => {
            setShowSpecialists(false);
            setSelectedReason(null);
          }}>
            Back
          </button>
        </div>
      ) : (
        // Activities screen
        <div className="selected-section">
          <h2>You're feeling {selectedMood} {isNegativeMood && intensityLevel ? `(${intensityLevel}/10)` : '💬'}</h2>
          <p>Here are some activities to help with that:</p>
          <ul className="activity-list">
            {activities[selectedMood].map((activity, index) => (
              <li key={index}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={completedTasks.includes(activity)}
                    onChange={() => handleCheckboxChange(activity)}
                  />
                  {activity}
                </label>
              </li>
            ))}
          </ul>
          
          {allTasksCompleted && (
            <>
              <p className="thank-you">🎉 Thank you for taking care of yourself today!</p>
              
              {/* For negative moods with high intensity, ask if they feel better */}
              {isNegativeMood && intensityLevel > 5 && feelingBetter === null && (
                <div className="feeling-better-question">
                  <h3>Did these activities help you feel better?</h3>
                  <div className="feeling-better-buttons">
                    <button 
                      className="yes-button"
                      onClick={() => handleFeelingBetterResponse(true)}
                    >
                      Yes, I feel better
                    </button>
                    <button 
                      className="no-button"
                      onClick={() => handleFeelingBetterResponse(false)}
                    >
                      No, I still feel {selectedMood.toLowerCase()}
                    </button>
                  </div>
                </div>
              )}
              
              {isNegativeMood && intensityLevel > 5 && feelingBetter === true && (
                <p className="positive-feedback">That's great! Remember to take time for self-care regularly.</p>
              )}
            </>
          )}
          
          <button 
            className="back-button" 
            onClick={() => {
              if (isNegativeMood) {
                setShowIntensityScale(true);
                setIntensityLevel(null);
              } else {
                setSelectedMood(null);
              }
            }}
          >
            Back
          </button>
        </div>
      )}

      {!showIntensityScale && !showReasons && !showSpecialists && (
        <button className="back-button main-back" onClick={() => onNavigate('dashboard')}>
          Back to Dashboard
        </button>
      )}
    </div>
  );
};

export default FeelingToday;