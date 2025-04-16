// LoginSignup.jsx
import React, { useState } from "react";
import "./LoginSignup.css";
import userIcon from "../Assets/user.png";
import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/password.png";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

const LoginSignup = ({ onNavigate }) => {
  const [action, setAction] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    dob: "",
    gender: "",
    state: "",
    role: "",
    specialization: "",
    experience: "",
    fee: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store user data in localStorage, ensuring role is included
      const userData = {
        ...data.user,
        role: data.user.role || "user", // Ensure role exists
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      // Navigate to dashboard
      onNavigate("dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate fields based on role
      if (signupData.role === "therapist") {
        if (
          !signupData.specialization ||
          !signupData.experience ||
          !signupData.fee
        ) {
          throw new Error("Please complete all therapist fields");
        }
      }

      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Automatically login after successful signup
      const loginResponse = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Auto-login failed");
      }

      // Store user data in localStorage, ensuring role is included from signup
      const userData = {
        ...loginData.user,
        role: signupData.role || loginData.user.role || "user", // Ensure the selected role is stored
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      // Navigate to dashboard
      onNavigate("dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container">
      <div className="title-section">
        <div className="title">SafeSpace</div>
        <div className="tagline">Your Mind Matters. Always.</div>
      </div>

      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Processing...</div>}

      {action === "Login" ? (
        <div className="inputs">
          <div className="input">
            <img src={emailIcon} alt="email" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div className="input">
            <img src={passwordIcon} alt="password" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>

          <div className="forgot-password">
            Forgot Password? <span>Click here!</span>
          </div>

          <div className="submit-container">
            <div
              className={action === "Sign Up" ? "submit" : "submit gray"}
              onClick={() => setAction("Sign Up")}
            >
              Sign Up
            </div>
            <div
              className={action === "Login" ? "submit" : "submit gray"}
              onClick={handleLogin}
            >
              Login
            </div>
          </div>
        </div>
      ) : (
        <div className="inputs">
          <div className="input">
            <img src={userIcon} alt="user" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input">
            <img src={userIcon} alt="contact" />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number (+91)"
              value={signupData.contact}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setSignupData({ ...signupData, contact: value });
                }
              }}
              required
            />
          </div>
          <div className="input">
            <img src={userIcon} alt="calendar" />
            <input
              type="date"
              name="dob"
              value={signupData.dob}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input select-input">
            <img src={userIcon} alt="gender" />
            <select
              name="gender"
              className="select-field"
              value={signupData.gender}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input select-input">
            <img src={userIcon} alt="location" />
            <select
              name="state"
              className="select-field"
              value={signupData.state}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="input select-input">
            <img src={userIcon} alt="role" />
            <select
              name="role"
              className="select-field"
              value={signupData.role}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="therapist">Therapist</option>
            </select>
          </div>

          {signupData.role === "therapist" && (
            <div className="therapist-fields">
              <div className="input select-input">
                <img src={userIcon} alt="specialization" />
                <select
                  name="specialization"
                  className="select-field"
                  value={signupData.specialization}
                  onChange={handleSignupChange}
                >
                  <option value="">Select Specialization</option>
                  <option value="Family Counseling">Family Counseling</option>
                  <option value="Addiction Counseling">
                    Addiction Counseling
                  </option>
                  <option value="Trauma Therapy">Trauma Therapy</option>
                  <option value="Couples Therapy">Couples Therapy</option>
                  <option value="Cognitive Behavioral Therapy">
                    Cognitive Behavioral Therapy
                  </option>
                  <option value="Art Therapy">Art Therapy</option>
                  <option value="Psychoanalysis">Psychoanalysis</option>
                </select>
              </div>
              <div className="input">
                <img src={userIcon} alt="experience" />
                <input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  value={signupData.experience}
                  onChange={handleSignupChange}
                />
              </div>
              <div className="input">
                <img src={userIcon} alt="fee" />
                <input
                  type="number"
                  name="fee"
                  placeholder="Consultation Fee (₹)"
                  value={signupData.fee}
                  onChange={handleSignupChange}
                />
              </div>
            </div>
          )}

          <div className="input">
            <img src={emailIcon} alt="email" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input">
            <img src={passwordIcon} alt="password" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
            />
          </div>

          <div className="submit-container">
            <div
              className={action === "Login" ? "submit" : "submit gray"}
              onClick={() => setAction("Login")}
            >
              Login
            </div>
            <div
              className={action === "Sign Up" ? "submit" : "submit gray"}
              onClick={handleSignup}
            >
              Sign Up
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
