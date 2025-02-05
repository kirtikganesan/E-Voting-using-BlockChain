const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Replace with your MySQL user
  password: '',      // Replace with your MySQL password
  database: 'e_voting'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if the password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Check if the email already exists in the database
  const checkQuery = 'SELECT * FROM registration WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert the new user into the registration table
    const insertQuery = 'INSERT INTO registration (email, password) VALUES (?, ?)';
    db.query(insertQuery, [email, password], (err, results) => {
      if (err) {
        console.error('Error inserting into the database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Register successful' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Query the registration table for matching credentials
  const query = 'SELECT * FROM registration WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  });
});

app.get('/api/candidates', (req, res) => {
  const query = 'SELECT * FROM candidates';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching candidates:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add a new candidate
app.post('/api/candidates', (req, res) => {
  const { name, age, party, qualification } = req.body;

  if (age < 18) {
    return res.status(400).json({ error: 'Candidate must be at least 18 years old' });
  }

  const insertQuery = 'INSERT INTO candidates (name, age, party, qualification) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [name, age, party, qualification], (err, results) => {
    if (err) {
      console.error('Error inserting candidate:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Candidate registered successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
