const express = require("express");
const db = require("./db");
const router = express.Router();

// 📝 Test Route
router.get("/", (req, res) => {
  res.send("API is running!");
});

// ✅ User Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const [result] = await db.promise().execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    res.status(201).json({ message: "User registered!", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.promise().execute(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (users.length > 0) {
      res.json({ message: "Login successful!", user: users[0] });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
