import React, { useState, useEffect } from "react";
import "./Apppointments.css";

const Appointments = ({ userData, onNavigate }) => {
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [diagnosisForm, setDiagnosisForm] = useState({
    userid: "",
    userhealthrecord: "",
    mental_analysis: "",
    medication: "",
    Prescription: "",
  });
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({
    specialization: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    if (!userData || userData.role !== "therapist") {
      onNavigate("dashboard");
      return;
    }

    fetchAppointments();
    fetchTimeSlots();
  }, [userData]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // Updated to match server.js API endpoint for fetching therapist appointments
      const response = await fetch(`/api/appointments/${userData.userid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load appointments. Please try again later.");
      setIsLoading(false);
      console.error(err);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      // Updated to match server.js API endpoint for fetching therapist time slots
      const response = await fetch(`/api/time-slots/${userData.userid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }
      const data = await response.json();
      setTimeSlots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openDiagnosisModal = (appointment) => {
    setDiagnosisForm({
      userid: appointment.userid,
      userhealthrecord: "",
      mental_analysis: "",
      medication: "",
      Prescription: "",
    });
    setShowDiagnosisModal(true);
  };

  const handleDiagnosisChange = (e) => {
    const { name, value } = e.target;
    setDiagnosisForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitDiagnosis = async (e) => {
    e.preventDefault();
    try {
      // Add diagnosis endpoint - we need to create this in server.js
      const diagnosisResponse = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...diagnosisForm,
          therapistid: userData.userid,
        }),
      });

      if (!diagnosisResponse.ok) {
        throw new Error("Failed to submit diagnosis");
      }

      // Update appointment status to completed
      // We need to add this endpoint to server.js
      const updateResponse = await fetch(
        `/api/appointments/status/${diagnosisForm.userid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update appointment status");
      }

      setShowDiagnosisModal(false);
      fetchAppointments(); // Refresh the appointments list
      alert("Diagnosis submitted successfully!");
    } catch (err) {
      alert("Failed to submit diagnosis. Please try again.");
      console.error(err);
    }
  };

  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setNewTimeSlot((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTimeSlot = async (e) => {
    e.preventDefault();
    try {
      // Updated to match a proper endpoint for adding time slots
      const response = await fetch("/api/time-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTimeSlot,
          therapistid: userData.userid,
          is_booked: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add time slot");
      }

      setShowAddSlotModal(false);
      fetchTimeSlots(); // Refresh the time slots list
      alert("Time slot added successfully!");
      setNewTimeSlot({
        specialization: "",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      alert("Failed to add time slot. Please try again.");
      console.error(err);
    }
  };

  const deleteTimeSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) {
      return;
    }

    try {
      // Updated to match a proper endpoint for deleting time slots
      const response = await fetch(`/api/time-slots/${slotId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete time slot");
      }

      fetchTimeSlots(); // Refresh the time slots list
      alert("Time slot deleted successfully!");
    } catch (err) {
      alert("Failed to delete time slot. Please try again.");
      console.error(err);
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.start_time); // Updated to match the API response
    const now = new Date();

    if (activeTab === "upcoming") {
      return appointmentDate >= now && appointment.status !== "completed";
    } else if (activeTab === "past") {
      return appointmentDate < now || appointment.status === "completed";
    }
    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointments-container">
      <div className="header">
        <button className="back-button" onClick={() => onNavigate("dashboard")}>
          Back to Dashboard
        </button>
        <h1>My Appointments</h1>
        <div className="user-info">
          <span>Dr. {userData.name}</span>
          <span className="specialization">{userData.specialization}</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Appointments
        </button>
        <button
          className={`tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Appointments
        </button>
        <button
          className={`tab ${activeTab === "availability" ? "active" : ""}`}
          onClick={() => setActiveTab("availability")}
        >
          Manage Availability
        </button>
      </div>

      <div className="content-area">
        {activeTab !== "availability" && (
          <>
            {filteredAppointments.length === 0 ? (
              <div className="no-appointments">
                <p>No {activeTab} appointments found.</p>
              </div>
            ) : (
              <div className="appointments-list">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.appointmentid}
                    className="appointment-card"
                  >
                    <div className="appointment-header">
                      <h3>
                        Appointment with{" "}
                        {appointment.therapist_name || "Patient"}
                      </h3>
                      <span className={`status ${appointment.status}`}>
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <p>
                        <strong>Date:</strong>{" "}
                        {formatDate(appointment.start_time)}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {formatTime(appointment.start_time)} -{" "}
                        {formatTime(appointment.end_time)}
                      </p>
                      <p>
                        <strong>Specialization:</strong>{" "}
                        {appointment.Specialization || "General Consultation"}
                      </p>
                      <p>
                        <strong>Booking Time:</strong>{" "}
                        {formatDateTime(appointment.booking_time)}
                      </p>
                    </div>
                    <div className="appointment-actions">
                      {activeTab === "upcoming" && (
                        <button
                          className="complete-btn"
                          onClick={() => openDiagnosisModal(appointment)}
                        >
                          Complete & Add Diagnosis
                        </button>
                      )}
                      {activeTab === "past" &&
                        appointment.status === "completed" && (
                          <button className="view-diagnosis-btn">
                            View Diagnosis
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "availability" && (
          <div className="availability-section">
            <div className="add-slot-section">
              <button
                className="add-slot-btn"
                onClick={() => setShowAddSlotModal(true)}
              >
                Add New Time Slot
              </button>
            </div>

            <h3>Your Available Time Slots</h3>
            {timeSlots.length === 0 ? (
              <p>
                No time slots available. Add some slots to let patients book
                appointments.
              </p>
            ) : (
              <table className="time-slots-table">
                <thead>
                  <tr>
                    <th>Specialization</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr
                      key={slot.slotid}
                      className={slot.is_booked ? "booked" : ""}
                    >
                      <td>{slot.specialization}</td>
                      <td>{formatDateTime(slot.start_time)}</td>
                      <td>{formatDateTime(slot.end_time)}</td>
                      <td>
                        <span
                          className={`slot-status ${
                            slot.is_booked ? "booked" : "available"
                          }`}
                        >
                          {slot.is_booked ? "Booked" : "Available"}
                        </span>
                      </td>
                      <td>
                        {!slot.is_booked && (
                          <button
                            className="delete-slot-btn"
                            onClick={() => deleteTimeSlot(slot.slotid)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Diagnosis Modal */}
      {showDiagnosisModal && (
        <div className="modal-overlay">
          <div className="modal diagnosis-modal">
            <h2>Add Diagnosis & Treatment</h2>
            <form onSubmit={submitDiagnosis}>
              <div className="form-group">
                <label>Patient Health Record</label>
                <textarea
                  name="userhealthrecord"
                  value={diagnosisForm.userhealthrecord}
                  onChange={handleDiagnosisChange}
                  placeholder="Enter patient's health record information"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Mental Analysis</label>
                <textarea
                  name="mental_analysis"
                  value={diagnosisForm.mental_analysis}
                  onChange={handleDiagnosisChange}
                  placeholder="Enter mental health analysis"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Medication</label>
                <input
                  type="text"
                  name="medication"
                  value={diagnosisForm.medication}
                  onChange={handleDiagnosisChange}
                  placeholder="Enter recommended medication"
                />
              </div>
              <div className="form-group">
                <label>Prescription</label>
                <textarea
                  name="Prescription"
                  value={diagnosisForm.Prescription}
                  onChange={handleDiagnosisChange}
                  placeholder="Enter detailed prescription"
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowDiagnosisModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="modal-overlay">
          <div className="modal add-slot-modal">
            <h2>Add New Time Slot</h2>
            <form onSubmit={addTimeSlot}>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={newTimeSlot.specialization}
                  onChange={handleTimeSlotChange}
                  placeholder="E.g., Cognitive Behavioral Therapy"
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={newTimeSlot.start_time}
                  onChange={handleTimeSlotChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={newTimeSlot.end_time}
                  onChange={handleTimeSlotChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Time Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
