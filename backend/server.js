// server.js
const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;
app.use(
  session({
    secret: "secret", // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "satya",
  password: "1234",
  database: "portfolio_tracker",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");

  // Create users table if not exists
  const createTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  db.query(createTable);
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  const { name, phone_number, email, password } = req.body;

  if (!name || !phone_number || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error hashing password" });
    }

    const query =
      "INSERT INTO users (name, phone_number, email, password) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [name, phone_number, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ message: "Error registering user" });
        }
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Query to find the user by email
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ message: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Error comparing passwords" });
      }

      console.log("Password comparison result:", isMatch); // Debug log for comparison result

      if (isMatch) {
        userId = results[0].id;
        return res.json({
          success: true,
          message: "Login successful",
          userId: results[0].id,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  });
});
// Add stock endpoint
app.post("/addStock", (req, res) => {
  console.log(req.body);
  console.log(userId);
  if (!userId) {
    return res.status(401).send("User not logged in");
  }
  const {
    name,
    ticker,
    quantity,
    buy_price,
    current_price,
    total_value,
    percentage_gain,
  } = req.body;
  const query =
    "INSERT INTO stocks (user_id, name, ticker, quantity, buy_price,current_price,total_value,percentage_gain) VALUES (?, ?, ?, ?, ?,?,?,?)";
  db.query(
    query,
    [
      userId,
      name,
      ticker,
      quantity,
      buy_price,
      current_price,
      total_value,
      percentage_gain,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to add stock");
        return;
      }
      res.send("Stock added successfully");
    }
  );
});
app.get("/getStocks", (req, res) => {
  console.log("Getting stocks");
  console.log(userId);

  if (!userId) {
    return res.status(401).send("User not logged in");
  }

  // Query to get all stocks associated with the user
  const query = "SELECT * FROM stocks WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching stocks:", err);
      return res.status(500).send("Failed to fetch stocks");
    }
    console.log(results);
    res.json({ stocks: results });
  });
});
// Example Express route for updating a stock
app.post("/updateStock", (req, res) => {
  console.log(req.body);
  if (!userId) {
    return res.status(401).send("Unauthorized: Please log in.");
  }

  const {
    id,
    name,
    ticker,
    quantity,
    buy_price,
    total_value,
    percentage_gain,
  } = req.body;

  // Update query should only set values that are actually changing (no need to update `id`)
  const updateQuery = `
    UPDATE stocks
    SET name = ?, ticker = ?, quantity = ?, buy_price = ?, total_value = ?, percentage_gain = ?
    WHERE user_id = ? AND id = ?`;

  const updateValues = [
    name,
    ticker,
    quantity,
    buy_price,
    total_value,
    percentage_gain,
    userId,
    id,
  ];

  db.execute(updateQuery, updateValues, (err, results) => {
    if (err) {
      console.error("Error updating stock:", err);
      return res.status(500).send("Error updating stock.");
    }

    if (results.affectedRows > 0) {
      res.send("Stock updated successfully.");
    } else {
      res.status(404).send("Stock not found.");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
server.js;
server.js;
