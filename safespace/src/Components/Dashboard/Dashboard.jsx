import React, { useState} from 'react'
import './Dashboard.css'
const Dashboard = ({onNavigate}) => {
    const[feeling,setFeeling]= useState('');
    const quotes = [
        "Healing takes time, and asking for help is a courageous step toward it.",
    "Your journey matters. Take each moment as it comes.",
    "Peace begins with patience and self-compassion.",
    "The path to wellness is not linear, but it is always worth taking."
    ];
    const randomQuote=quotes[Math.floor(Math.random() * quotes.length)];
    return (
        <div className="dashboard-container">
            <div className='dashboard-logo'>
                <div className='logo-icon'>
                 <span> <img src='/favicon.ico' alt='safespace logo' style={{ width: '24px', height: '24px' }}/> </span>
                </div>
            </div>
            <div className="dashboard-content">
                <div className="quote-container">
                    <p className='quote'>"{randomQuote}"</p>
                </div>
                <div className='action-buttons'>
                    <button className='feeling-btn' 
                        onClick={()=>{
                            setFeeling(true);
                            window.alert("coming soon");
                            }}>
                        How are you feeling today? →
                    </button>
                    <button className='session-btn' onClick={()=>window.alert("TO DO!")}>
                        Book a session →
                    </button>
                </div>
            <button className='logout-btn' onClick={onNavigate}>
                Logout
            </button>
            </div>
        </div>
    )
}
export default Dashboard