const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000; // ✅ This should NOT be the MySQL port

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Mental Health App Backend is Running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});




/*const express = require("express");
const db = require("./db"); // Ensure this is your database connection file

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // To handle JSON requests

// ✅ Add a test route for root `/`
app.get("/", (req, res) => {
  res.send("🚀 Mental Health App Backend is Running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});*/


/*const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const routes = require("./routes");
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});*/



/*require("dotenv").config({ path: "./db.env" });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Parse JSON request body

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL on Aiven!");
    }
});

// Signup route
app.post("/signup", async (req, res) => {
    const { name, email, password, role, date_of_birth, gender, contact_number, location_state } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userid = `user_${Date.now()}`; // Generate unique ID

        const query = `
            INSERT INTO user (userid, name, email, password_hash, role, date_of_birth, gender, contact_number, location_state, account_created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(query, [userid, name, email, hashedPassword, role, date_of_birth, gender, contact_number, location_state], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error inserting user" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Error hashing password" });
    }
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const query = "SELECT * FROM user WHERE email = ?";
    
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // Compare password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userid: user.userid, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});*/

