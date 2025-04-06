const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "jhsd-23212015db-mental-health-app-jhsd.h.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_i23l1tdch0PePoMdRIL",
  database: "SafeSpace",
  port: 18274,
  connectTimeout: 10000 // 10 seconds timeout
  // 🔻 SSL is now disabled, so we remove the `ssl` option
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to Aiven MySQL database (no SSL)!");
});



module.exports = db;





/*const mysql = require("mysql2");
const fs = require("fs");

const db = mysql.createConnection({
  host: "jhsd-23212015db-mental-health-app-jhsd.h.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_i23l1tdch0PePoMdRIL",
  database: "SafeSpace",
  port: 18274,
  connectTimeout: 10000, // 10 seconds timeout
  ssl: {
    ca: fs.readFileSync("C:/ca.pem"), // Ensure this path is correct
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to Aiven MySQL database!");
});

module.exports = db;
*/

/*const mysql = require("mysql2");

// Create a MySQL connection with SSL
const db = mysql.createConnection({
  host: "jhsd-23212015db-mental-health-app-jhsd.h.aivencloud.com", // Aiven MySQL Host
  user: "avnadmin", // Aiven MySQL username
  password: "AVNS_i23l1tdch0PePoMdRIL", // Aiven MySQL password
  database: "SafeSpace", // Change to your actual database name
  port: 18274, // Aiven MySQL Port
  ssl: {
    ca: "C:/ca.pem" // Ensure the correct path to your SSL certificate
  }
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to Aiven MySQL database!");
});

module.exports = db;*/

/*const mysql = require("mysql2");
const fs = require("fs");

// Create a MySQL connection with SSL
const db = mysql.createConnection({
  host: "jhsd-23212015db-mental-health-app-jhsd.h.aivencloud.com", // Aiven MySQL Host
  user: "avnadmin", // Aiven MySQL username
  password: "AVNS_i23l1tdch0PePoMdRIL", // Aiven MySQL password
  database: "SafeSpace", // Change to your actual database name
  port: 18274, // Aiven MySQL Port
  ssl: {
    ca: fs.readFileSync("C:/ca.pem"), // Read SSL certificate
    rejectUnauthorized: true // Accept the self-signed certificate
  }
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to Aiven MySQL database!");
});

module.exports = db;
*/