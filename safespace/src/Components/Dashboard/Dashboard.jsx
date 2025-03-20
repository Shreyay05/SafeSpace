import React from 'react'
import './Dashboard.css'
const Dashboard = ({onNavigate}) => {
    return (
        <div className="dashboard-container">
            <div className='dashboard-header'>
                <h1>Welcome to SafeSpace!</h1>
                <p>Your mind matters.Always.</p>
            </div>
            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>Dashboard</h2>
                    <p>This is your empty dashboard page. Content will be added later.</p>
                    <button className='logout-btn' onClick={onNavigate}>Logout</button>
                </div>
            </div>
        </div>
    )
}
export default Dashboard