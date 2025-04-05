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
    'Tackle a task you’ve been putting off ✅',
    'Write down things you’re proud of ✍️',
    'Help someone else—it’ll boost both your confidence 💪',
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
    'Write a letter you don’t send ✍️',
    'Use physical energy—jump, punch a pillow, etc. 🥊',
  ],
};

const FeelingToday = ({ onNavigate }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  
    const handleMoodSelect = (mood) => {
      setSelectedMood(mood);
      setCompletedTasks([]);
      setAllTasksCompleted(false);
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
    }
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
      ) : (
        <div className="selected-section">
          <h2>You're feeling {selectedMood} 💬</h2>
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
            {allTasksCompleted && <p className="thank-you">🎉 Thank you for taking care of yourself today!</p>}
            </div>
      )}

      <button className="back-button" onClick={() => onNavigate('dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default FeelingToday;
