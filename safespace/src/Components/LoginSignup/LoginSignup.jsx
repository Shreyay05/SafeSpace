import React from 'react'
import './LoginSignup.css'
import { useState } from 'react';
import background from '../Assets/background.png'
import user_icon from '../Assets/user.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

const LoginSignup = ({onNavigate}) => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (action === "Login") {
        // Handle login
        if (!email || !password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store user info in localStorage for session management
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to dashboard
        onNavigate('dashboard');
      } else {
        // Handle sign up
        if (!name || !email || !password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          setLoading(false);
          return;
        }

        // Password validation (at least 6 characters)
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        // Check if email already exists
        const checkEmailResponse = await fetch('http://localhost:3001/api/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const checkEmailData = await checkEmailResponse.json();

        if (checkEmailData.exists) {
          setError("Email already in use. Please use a different email.");
          setLoading(false);
          return;
        }

        // Register user
        const response = await fetch('http://localhost:3001/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Login the user after successful registration
        const loginResponse = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Auto-login failed');
        }

        // Store user info in localStorage for session management
        localStorage.setItem('user', JSON.stringify(loginData.user));
        
        // Navigate to dashboard
        onNavigate('dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      {/* Title and Tagline */}
      <div className="title-section">
        <div className="title">SafeSpace</div>
        <div className="tagline">Your Mind Matters. Always.</div>
      </div>

      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="inputs">
        {action === "Login" ? <div></div> : 
          <div className="input">
            <img src={user_icon} alt="" />
            <input 
              type="text" 
              placeholder="Name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
        }
        
        <div className="input">
          <img src={email_icon} alt="" />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
      </div>

      {action === "Sign Up" ? <div></div> :
        <div className="forgot-password">Forgot Password? <span>Click here!</span></div>
      }
      
      <div className="submit-container">
        <div 
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => {
            if (action === "Login") {
              setAction("Sign Up");
            } else {
              handleSubmit();
            }
          }}
        >
          Sign Up
        </div>
        <div 
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            if (action === "Sign Up") {
              setAction("Login");
            } else {
              handleSubmit();
            }
          }}
        >
          Login
        </div>
      </div>

      {loading && <div className="loading-message">Processing...</div>}
    </div>
  )
}

export default LoginSignup;