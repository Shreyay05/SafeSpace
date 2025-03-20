import React from 'react'
import './LoginSignup.css'
import { useState } from 'react';
//import { useNavigate } from "react-router-dom" 
import background from '../Assets/background.png'
import user_icon from '../Assets/user.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
const LoginSignup = ({onNavigate}) => {

  const[action,setAction]=useState("Login");
  const [email, setEmail] = useState("") // temporary 
  const [password, setPassword] = useState("") // temporary 
  const [name, setName] = useState("") // temporary 

  //const navigate = useNavigate()
  const handlesubmit = () =>{
    // authentication to be doen here later when connecting backend 
    onNavigate()
  }

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
      <div className="inputs">
        {action==="Login"?<div></div>:<div className="input">
          <img src={user_icon} alt="" />
          <input 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e)=>setName(e.target.value)} 
          />
        </div>
        }
        
        <div className="input">
          <img src={email_icon} alt="" />
          <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)} 
          />
        </div>
      </div>
      {action==="Sign Up"?<div></div>:
      <div className="forgot-password">Forgot Password? <span>Click here!</span></div>
      }
      
      <div className="submit-container">
        <div className={action==="Login"?"submit gray":"submit"}
        onClick={()=>{
            if(action === "Login"){
            setAction("Sign Up")
            }else{
                handlesubmit()
            }
            }}>Sign Up</div>
        <div className={action==="Sign Up"?"submit gray":"submit"}
        onClick={()=>
        {
            if(action==="Sign Up"){setAction("Login")}
            else{handlesubmit()}
        }
        }>Login</div>
      </div>
    </div>
  )
}

export default LoginSignup;