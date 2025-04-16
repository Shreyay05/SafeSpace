const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check if user exists by email
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  
  const query = 'SELECT * FROM user WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      // User exists
      return res.json({ exists: true });
    } else {
      // User doesn't exist
      return res.json({ exists: false });
    }
  });
});

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      contact, 
      dob, 
      gender, 
      state, 
      role,
      specialization,
      experience,
      fee 
    } = req.body;
    
    // Check if email already exists
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      // Check if contact number already exists
      if (contact) {
        db.query('SELECT * FROM user WHERE contact_number = ?', [contact], async (contactErr, contactResults) => {
          if (contactErr) {
            console.error('Database error:', contactErr);
            return res.status(500).json({ error: 'Database error' });
          }
          
          if (contactResults.length > 0) {
            return res.status(400).json({ error: 'Contact number already in use' });
          }
          
          proceedWithRegistration();
        });
      } else {
        proceedWithRegistration();
      }
      
      async function proceedWithRegistration() {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Generate a UUID for userid
        const userid = uuidv4();
        
        // Get current date for account_created_at
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Default role if not provided
        const userRole = role || 'user';
        
        // Insert the new user
        const insertQuery = `
          INSERT INTO user (
            userid, 
            name, 
            email, 
            password_hash, 
            role, 
            date_of_birth, 
            gender, 
            contact_number, 
            account_created_at, 
            location_state
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(
          insertQuery, 
          [
            userid, 
            name, 
            email, 
            hashedPassword, 
            userRole, 
            dob, 
            gender, 
            contact, 
            currentDate, 
            state
          ], 
          (insertErr) => {
            if (insertErr) {
              console.error('Error registering user:', insertErr);
              return res.status(500).json({ error: 'Error registering user' });
            }
            
            // If therapist, insert additional information
            if (userRole === 'therapist' && specialization) {
              const therapistId = uuidv4();
              const therapistQuery = `
                INSERT INTO therapists (
                  therapistid,
                  Specialization, 
                  YearsOfExperience, 
                  consultation_fee,
                  userid
                ) 
                VALUES (?, ?, ?, ?, ?)
              `;
              
              db.query(
                therapistQuery, 
                [therapistId, specialization, experience, fee, userid], 
                (therapistErr) => {
                  if (therapistErr) {
                    console.error('Error registering therapist info:', therapistErr);
                    // Continue anyway, as base user is registered
                  }
                }
              );
            }
            
            return res.status(201).json({ 
              message: 'User registered successfully',
              userid: userid
            });
          }
        );
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const user = results[0];
      
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Return user data (except password)
      const userData = {
        userid: user.userid,
        name: user.name,
        email: user.email,
        role: user.role,
        dob: user.date_of_birth,
        gender: user.gender,
        contactNumber: user.contact_number,
        location: user.location_state
      };
      
      return res.json({
        message: 'Login successful',
        user: userData
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile data
app.get('/api/user/:userid', (req, res) => {
  try {
    const { userid } = req.params;
    
    const query = `
      SELECT 
        userid, 
        name, 
        email, 
        role, 
        date_of_birth, 
        gender, 
        contact_number, 
        location_state, 
        profile_photo,
        account_created_at 
      FROM user 
      WHERE userid = ?
    `;
    
    db.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = results[0];
      
      return res.json({
        user: user
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const { email, contactNumber, location } = req.body;
    
    // Check if email already exists for different user
    if (email) {
      db.query('SELECT * FROM user WHERE email = ? AND userid != ?', [email, userid], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ error: 'Email already in use by another account' });
        }
        
        updateUserDetails();
      });
    } else {
      updateUserDetails();
    }
    
    function updateUserDetails() {
      // Check if contact number already exists for different user
      if (contactNumber) {
        db.query('SELECT * FROM user WHERE contact_number = ? AND userid != ?', [contactNumber, userid], async (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          if (results.length > 0) {
            return res.status(400).json({ error: 'Contact number already in use by another account' });
          }
          
          performUpdate();
        });
      } else {
        performUpdate();
      }
    }
    
    function performUpdate() {
      const updateQuery = `
        UPDATE user 
        SET 
          email = COALESCE(?, email),
          contact_number = COALESCE(?, contact_number),
          location_state = COALESCE(?, location_state)
        WHERE userid = ?
      `;
      
      db.query(updateQuery, [email, contactNumber, location, userid], (updateErr, results) => {
        if (updateErr) {
          console.error('Error updating user:', updateErr);
          return res.status(500).json({ error: 'Error updating user profile' });
        }
        
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Get updated user data
        db.query('SELECT * FROM user WHERE userid = ?', [userid], (fetchErr, fetchResults) => {
          if (fetchErr) {
            console.error('Error fetching updated user:', fetchErr);
            return res.status(500).json({ error: 'Error fetching updated user data' });
          }
          
          if (fetchResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          const updatedUser = fetchResults[0];
          
          // Return user data (except password)
          const userData = {
            userid: updatedUser.userid,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            dob: updatedUser.date_of_birth,
            gender: updatedUser.gender,
            contactNumber: updatedUser.contact_number,
            location: updatedUser.location_state
          };
          
          return res.json({
            message: 'Profile updated successfully',
            user: userData
          });
        });
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all therapists
app.get('/api/therapists', (req, res) => {
  // Use a JOIN to get both therapist and user information
  const query = `
    SELECT t.therapistid, u.name as Username, t.Specialization, 
           t.YearsOfExperience, t.consultation_fee, u.userid
    FROM therapists t
    JOIN user u ON t.userid = u.userid
    WHERE u.role = 'therapist'
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    return res.json(results);
  });
});

// Get therapist by ID
app.get('/api/therapist/:therapistid', (req, res) => {
  const { therapistid } = req.params;
  
  const query = `
    SELECT t.*, u.name, u.email, u.contact_number, u.location_state 
    FROM therapists t
    JOIN user u ON t.userid = u.userid
    WHERE t.therapistid = ?
  `;
  
  db.query(query, [therapistid], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    
    return res.json({
      therapist: results[0]
    });
  });
});

// Get available time slots for a therapist
app.get('/api/availability/:therapistid/:date', (req, res) => {
  const { therapistid, date } = req.params;
  
  // Convert the date parameter to start/end of day for querying
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  const formattedStartDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
  const formattedEndDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
  
  // Query to get all booked slots for the therapist on the specified date
  const query = `
    SELECT booking_time 
    FROM Bookings 
    WHERE therapistid = ? 
    AND booking_time BETWEEN ? AND ?
    AND status = 'booked'
  `;
  
  db.query(query, [therapistid, formattedStartDate, formattedEndDate], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Extract all booked hours into an array
    const bookedHours = results.map(booking => {
      const bookingTime = new Date(booking.booking_time);
      return bookingTime.getHours();
    });
    
    // Create an array of all possible slots (9 AM to 5 PM)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const timeString = `${hour12}:00 ${ampm}`;
      
      allSlots.push({
        time: timeString,
        slotId: `slot-${date}-${hour}`,
        disabled: bookedHours.includes(hour)
      });
    }
    
    res.json(allSlots);
  });
});

// Add new time slot (for therapists to set their availability)
app.post('/api/time-slots', (req, res) => {
  const { therapistid, specialization, start_time, end_time } = req.body;
  
  const query = `
    INSERT INTO time_slots (therapistid, specialization, start_time, end_time, is_booked)
    VALUES (?, ?, ?, ?, 0)
  `;
  
  db.query(query, [therapistid, specialization, start_time, end_time], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    return res.status(201).json({
      message: 'Time slot added successfully',
      slotid: result.insertId
    });
  });
});

// Delete time slot
app.delete('/api/time-slots/:slotId', (req, res) => {
  const { slotId } = req.params;
  
  const query = 'DELETE FROM time_slots WHERE slotid = ? AND is_booked = 0';
  
  db.query(query, [slotId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Cannot delete booked time slot or slot not found' });
    }
    
    return res.json({ message: 'Time slot deleted successfully' });
  });
});

// Book an appointment
app.post('/api/appointments', (req, res) => {
  const { userid, therapistid, appointment_time } = req.body;

  // Convert ISO 8601 string to MySQL DATETIME format
  const appointmentDate = new Date(appointment_time);
  const formattedAppointmentTime = appointmentDate.toISOString().slice(0, 19).replace('T', ' ');
  
  // First check if this slot is already booked
  const checkQuery = `
    SELECT COUNT(*) as count
    FROM Bookings
    WHERE therapistid = ?
    AND booking_time = ?
    AND status = 'booked'
  `;
  
  db.query(checkQuery, [therapistid, formattedAppointmentTime], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Booking check error:', checkErr);
      return res.status(500).json({ error: 'Error checking availability' });
    }
    
    if (checkResult[0].count > 0) {
      return res.status(409).json({ 
        error: 'This time slot has just been booked by someone else. Please select another time.'
      });
    }
    
    // Time slot is available, proceed with booking
    const createBookingQuery = 'INSERT INTO Bookings (userid, therapistid, booking_time, status) VALUES (?, ?, ?, ?)';

    db.query(createBookingQuery, [userid, therapistid, formattedAppointmentTime, 'booked'], (err, result) => {
      if (err) {
        console.error('Booking creation error:', err);
        return res.status(500).json({ error: 'Error creating booking' });
      }

      return res.status(201).json({ 
        message: 'Appointment booked successfully',
        appointmentId: result.insertId,
        appointment: {
          userid: userid,
          therapistid: therapistid,
          booking_time: formattedAppointmentTime,
          status: 'booked'
        }
      });
    });
  });
});

// Update appointment status
app.put('/api/appointments/status/:appointmentId', (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  
  const query = 'UPDATE Bookings SET status = ? WHERE appointmentid = ?';
  
  db.query(query, [status, appointmentId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    return res.json({ message: 'Appointment status updated successfully' });
  });
});

// Get user's appointments
app.get('/api/appointments/:userid', (req, res) => {
  const { userid } = req.params;
  
  // First check the role of the user
  db.query('SELECT role FROM user WHERE userid = ?', [userid], (roleErr, roleResult) => {
    if (roleErr) {
      console.error('Database error:', roleErr);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (roleResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userRole = roleResult[0].role;
    let query;
    
    if (userRole === 'therapist') {
      // If user is a therapist, get their appointments with patients
      query = `
        SELECT b.appointmentid, b.booking_time, b.status, 
               u.name as patient_name, u.email as patient_email
        FROM Bookings b
        JOIN user u ON b.userid = u.userid
        WHERE b.therapistid = (
          SELECT therapistid FROM therapists WHERE userid = ?
        )
        ORDER BY b.booking_time DESC
      `;
    } else {
      // If user is a patient, get their appointments with therapists
      query = `
        SELECT b.appointmentid, b.booking_time, b.status, 
               u.name as therapist_name, t.Specialization
        FROM Bookings b
        JOIN therapists t ON b.therapistid = t.therapistid
        JOIN user u ON t.userid = u.userid
        WHERE b.userid = ?
        ORDER BY b.booking_time DESC
      `;
    }
    
    db.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      return res.json(results);
    });
  });
});

// Add diagnosis record
app.post('/api/diagnosis', (req, res) => {
  const { therapistid, userid, userhealthrecord, mental_analysis, medication, Prescription } = req.body;
  
  const query = `
    INSERT INTO diagnosis 
    (therapistid, userid, userhealthrecord, mental_analysis, medication, Prescription)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(
    query, 
    [therapistid, userid, userhealthrecord, mental_analysis, medication, Prescription], 
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      return res.status(201).json({
        message: 'Diagnosis added successfully',
        id: result.insertId
      });
    }
  );
});

// Get user's prescriptions
app.get('/api/prescriptions/:userid', (req, res) => {
  const { userid } = req.params;
  
  const query = `
    SELECT 
      id,
      therapistid,
      userid,
      userhealthrecord,
      mental_analysis,
      medication,
      Prescription
    FROM 
      diagnosis
    WHERE 
      userid = ?
    ORDER BY 
      id DESC
  `;
  
  db.query(query, [userid], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    return res.json({
      prescriptions: results
    });
  });
});

// Get all community posts
app.get('/api/community-posts', (req, res) => {
  try {
    // Query to get all posts with user information
    const query = `
      SELECT cp.*, u.name as username
      FROM community_posts cp
      LEFT JOIN user u ON cp.userid = u.userid
      ORDER BY cp.created_at DESC
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Format the results
      const formattedPosts = results.map(post => ({
        ...post,
        liked: post.liked === 1, // Convert tinyint to boolean
      }));
      
      return res.json({ posts: formattedPosts });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new post
app.post('/api/community-posts', (req, res) => {
  try {
    const { userid, caption } = req.body;
    
    if (!userid || !caption) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const query = `
      INSERT INTO community_posts (
        userid,
        caption,
        reactions,
        liked,
        comments,
        created_at
      )
      VALUES (?, ?, 0, 0, '[]', CURRENT_TIMESTAMP)
    `;
    
    db.query(query, [userid, caption], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get the user's name to return with the post data
      db.query('SELECT name FROM user WHERE userid = ?', [userid], (userErr, userResults) => {
        if (userErr) {
          console.error('Database error:', userErr);
          return res.status(500).json({ error: 'Database error' });
        }
        
        const username = userResults.length > 0 ? userResults[0].name : 'User';
        
        // Return the complete new post object
        return res.status(201).json({ 
          message: 'Post created successfully',
          post: {
            id: result.insertId,
            userid: userid,
            caption: caption,
            reactions: 0,
            liked: false,
            comments: '[]',
            created_at: new Date().toISOString(),
            username: username
          }
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike a post
app.put('/api/community-posts/:postId/like', (req, res) => {
  try {
    const { postId } = req.params;
    const { liked } = req.body;
    
    // Update the post's liked status and reactions count
    const query = `
      UPDATE community_posts
      SET 
        liked = ?,
        reactions = reactions ${liked ? '+1' : '-1'}
      WHERE id = ?
    `;
    
    db.query(query, [liked ? 1 : 0, postId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      return res.json({ 
        message: liked ? 'Post liked successfully' : 'Post unliked successfully'
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment to a post
app.post('/api/community-posts/:postId/comment', (req, res) => {
  try {
    const { postId } = req.params;
    const { userid, comment } = req.body;
    
    if (!comment || !userid) {
      return res.status(400).json({ error: 'Comment and user ID are required' });
    }
    
    // First, get the user's name
    db.query('SELECT name FROM user WHERE userid = ?', [userid], (userErr, userResults) => {
      if (userErr) {
        console.error('Database error:', userErr);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const username = userResults.length > 0 ? userResults[0].name : 'User';
      
      // Then, get the current comments
      db.query('SELECT comments FROM community_posts WHERE id = ?', [postId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        // Parse existing comments
        let comments = [];
        try {
          comments = JSON.parse(results[0].comments || '[]');
        } catch (e) {
          console.error('Error parsing comments:', e);
          comments = [];
        }
        
        // Add the new comment with username
        const newComment = {
          userid: userid,
          username: username,
          text: comment,
          timestamp: new Date().toISOString()
        };
        
        comments.push(newComment);
        
        // Update the post with the new comments array
        const updateQuery = `
          UPDATE community_posts
          SET comments = ?
          WHERE id = ?
        `;
        
        db.query(updateQuery, [JSON.stringify(comments), postId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Database error:', updateErr);
            return res.status(500).json({ error: 'Database error' });
          }
          
          return res.status(201).json({ 
            message: 'Comment added successfully',
            comment: newComment
          });
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific user's posts
app.get('/api/community-posts/user/:userid', (req, res) => {
  try {
    const { userid } = req.params;
    
    const query = `
      SELECT cp.*, u.name as username
      FROM community_posts cp
      LEFT JOIN user u ON cp.userid = u.userid
      WHERE cp.userid = ?
      ORDER BY cp.created_at DESC
    `;
    
    db.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Format the results
      const formattedPosts = results.map(post => ({
        ...post,
        liked: post.liked === 1, // Convert tinyint to boolean
      }));
      
      return res.json({ posts: formattedPosts });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Get therapist's appointments
app.get('/api/therapist-appointments/:therapistid', (req, res) => {
  const { therapistid } = req.params;
  
  const query = `
    SELECT b.appointmentid, b.booking_time, b.status, 
           u.name as patient_name, u.email as patient_email,
           u.userid as patient_id
    FROM Bookings b
    JOIN user u ON b.userid = u.userid
    WHERE b.therapistid = ?
    ORDER BY b.booking_time DESC
  `;
  
  db.query(query, [therapistid], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    return res.json(results);
  });
});
// Get user's appointments
app.get('/api/appointments/:userid', (req, res) => {
  const { userid } = req.params;
  
  // First check the role of the user
  db.query('SELECT role FROM user WHERE userid = ?', [userid], (roleErr, roleResult) => {
    if (roleErr) {
      console.error('Database error:', roleErr);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (roleResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userRole = roleResult[0].role;
    let query;
    
    if (userRole === 'therapist') {
      // If user is a therapist, get their appointments with patients
      query = `
        SELECT b.appointmentid, b.booking_time, b.status, 
               u.name as patient_name, u.email as patient_email, u.userid as patient_id
        FROM Bookings b
        JOIN user u ON b.userid = u.userid
        WHERE b.therapistid IN (
          SELECT therapistid FROM therapists WHERE userid = ?
        )
        ORDER BY b.booking_time DESC
      `;
    } else {
      // If user is a patient, get their appointments with therapists
      query = `
        SELECT b.appointmentid, b.booking_time, b.status, 
               u.name as therapist_name, t.Specialization
        FROM Bookings b
        JOIN therapists t ON b.therapistid = t.therapistid
        JOIN user u ON t.userid = u.userid
        WHERE b.userid = ?
        ORDER BY b.booking_time DESC
      `;
    }
    
    db.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      return res.json(results);
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});