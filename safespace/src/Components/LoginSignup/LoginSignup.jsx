import React, { useState } from 'react';
import './LoginSignup.css';
import background from '../Assets/background.png';
import userIcon from '../Assets/user.png';
import emailIcon from '../Assets/email.png';
import passwordIcon from '../Assets/password.png';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const LoginSignup = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    dob: '',
    gender: '',
    state: '',
    role: '',
    specialization: '',
    experience: '',
    fee: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', loginData);
    onNavigate('dashboard');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signing up with:', signupData);
    onNavigate('dashboard');
  };

  return (
    <div className="loginSignup" style={{ backgroundImage: `url(${background})` }}>
      <div className="auth-container">
        <h2>SafeSpace</h2>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>Your Mind Matters. Always.</p>
        <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="input-with-icon">
              <img src={emailIcon} alt="email" className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="input-with-icon">
              <img src={passwordIcon} alt="password" className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="auth-input"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <p style={{ textAlign: 'center' }}>
              Forgot Password? <a href="#">Click here!</a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="auth-btn login"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
              <button type="submit" className="auth-btn signup">
                Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="input-with-icon">
              <img src={userIcon} alt="user" className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="auth-input"
                value={signupData.name}
                onChange={handleSignupChange}
                required
              />
            </div>
            <input
              type="text"
              name="contact"
              placeholder="Contact Number (+91)"
              className="auth-input"
              value={signupData.contact}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setSignupData({ ...signupData, contact: value });
                }
              }}
              required
            />
            <input
              type="date"
              name="dob"
              className="auth-input"
              value={signupData.dob}
              onChange={handleSignupChange}
              required
            />
            <select
              name="gender"
              className="auth-input"
              value={signupData.gender}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="state"
              className="auth-input"
              value={signupData.state}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state, idx) => (
                <option key={idx} value={state}>{state}</option>
              ))}
            </select>
            <select
              name="role"
              className="auth-input"
              value={signupData.role}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="therapist">Therapist</option>
            </select>

            {signupData.role === 'therapist' && (
              <div className="therapist-fields">
                <select
                  name="specialization"
                  className="auth-input"
                  value={signupData.specialization}
                  onChange={handleSignupChange}
                >
                  <option value="">Select Specialization</option>
                  <option value="Family Counseling">Family Counseling</option>
                  <option value="Addiction Counseling">Addiction Counseling</option>
                  <option value="Trauma Therapy">Trauma Therapy</option>
                  <option value="Couples Therapy">Couples Therapy</option>
                  <option value="Cognitive Behavioral Therapy">Cognitive Behavioral Therapy</option>
                  <option value="Art Therapy">Art Therapy</option>
                  <option value="Psychoanalysis">Psychoanalysis</option>
                </select>
                <input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  className="auth-input"
                  value={signupData.experience}
                  onChange={handleSignupChange}
                />
                <input
                  type="number"
                  name="fee"
                  placeholder="Consultation Fee (₹)"
                  className="auth-input"
                  value={signupData.fee}
                  onChange={handleSignupChange}
                />
              </div>
            )}

            <div className="input-with-icon">
              <img src={emailIcon} alt="email" className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </div>
            <div className="input-with-icon">
              <img src={passwordIcon} alt="password" className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="auth-input"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="auth-btn login"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button type="submit" className="auth-btn signup">
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
