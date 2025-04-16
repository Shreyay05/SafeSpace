import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Apppointments.css'; // Import the CSS file

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'

  // Get user details from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userid;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Make sure to use the full URL with the correct base URL for your API
        // Replace with your actual API base URL if different
        const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${baseURL}/api/appointments/${userId}`);
        
        // Log the response for debugging
        console.log('Appointments response:', response.data);
        
        // Set the appointments data
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointments();
    } else {
      setError('Please log in to view your appointments');
      setLoading(false);
    }
  }, [userId]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      await axios.put(`${baseURL}/api/appointments/status/${appointmentId}`, {
        status: newStatus
      });
      
      // Update the local state
      setAppointments(appointments.map(appointment => 
        appointment.appointmentid === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.booking_time);
      
      switch(filter) {
        case 'upcoming':
          return appointmentDate >= now && appointment.status !== 'cancelled';
        case 'past':
          return appointmentDate < now && appointment.status !== 'cancelled';
        case 'cancelled':
          return appointment.status === 'cancelled';
        default:
          return true; // 'all'
      }
    });
  };

  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get month name
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    
    // Get day
    const day = date.getDate();
    
    // Get year
    const year = date.getFullYear();
    
    // Get hours and format for 12-hour clock
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    // Get minutes with leading zero if needed
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center p-6">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2">Loading appointments...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Appointments</h1>
      
      <div className="mb-6">
        <label className="mr-2 font-medium">Filter:</label>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Past
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded">
          No appointments found for the selected filter.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div 
              key={appointment.appointmentid}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                  
                  </h3>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Date & Time:</span> {formatAppointmentDate(appointment.booking_time)}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`py-1 px-2 rounded text-white ${
                      appointment.status === 'booked' ? 'bg-green-500' : 
                      appointment.status === 'completed' ? 'bg-blue-500' : 
                      appointment.status === 'cancelled' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  {appointment.status === 'booked' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(appointment.appointmentid, 'completed')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Mark as Completed
                      </button>
                      <button 
                        onClick={() => handleStatusChange(appointment.appointmentid, 'cancelled')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;