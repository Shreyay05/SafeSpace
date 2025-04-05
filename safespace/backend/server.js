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
    const { name, email, password } = req.body;
    
    // Check if email already exists
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Generate a UUID for userid
      const userid = uuidv4();
      
      // Get current date for account_created_at
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Default role
      const role = 'user';
      
      // Insert the new user
      const insertQuery = 'INSERT INTO user (userid, name, email, password_hash, role, account_created_at) VALUES (?, ?, ?, ?, ?, ?)';
      
      db.query(insertQuery, [userid, name, email, hashedPassword, role, currentDate], (insertErr) => {
        if (insertErr) {
          console.error('Error registering user:', insertErr);
          return res.status(500).json({ error: 'Error registering user' });
        }
        
        return res.status(201).json({ 
          message: 'User registered successfully',
          userid: userid
        });
      });
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
        role: user.role
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});