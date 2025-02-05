const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL user
  password: '', // Replace with your MySQL password
  database: 'e_voting'
});

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

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const checkQuery = 'SELECT * FROM registration WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const insertQuery = 'INSERT INTO registration (email, password, has_Voted) VALUES (?, ?, ?)';
    db.query(insertQuery, [email, password, 0], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Registration successful' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM registration WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  });
});

// Endpoint to check voter status
app.get('/api/voter-status', (req, res) => {
  const email = req.query.email; // Get email from query string

  if (!email) {
    return res.status(400).json({ error: 'Email is required to check voter status' });
  }

  // Check voter status based on email
  const checkVoterStatusQuery = 'SELECT has_Voted FROM registration WHERE email = ?';
  db.query(checkVoterStatusQuery, [email], (err, results) => {
    if (err) {
      console.error('Error fetching voter status:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    const hasVoted = results[0].has_Voted === 1;
    res.json({ hasVoted });
  });
});


// Get all candidates
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

// Vote for a candidate
app.post('/api/vote', (req, res) => {
  const { email, candidateId } = req.body;

  if (!email || !candidateId) {
    return res.status(400).json({ error: 'Email and candidateId are required' });
  }

  // Check if voter has already voted
  const checkVoterQuery = 'SELECT has_Voted FROM registration WHERE email = ?';
  db.query(checkVoterQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    if (results[0].has_Voted === 1) {
      return res.status(400).json({ error: 'You have already voted!' });
    }

    // Cast the vote (increment the vote count for the selected candidate)
    const voteQuery = 'UPDATE candidates SET votes = votes + 1 WHERE id = ?';
    db.query(voteQuery, [candidateId], (err) => {
      if (err) {
        console.error('Error updating vote count:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Mark the user as having voted
      const markVotedQuery = 'UPDATE registration SET has_Voted = 1 WHERE email = ?';
      db.query(markVotedQuery, [email], (err) => {
        if (err) {
          console.error('Error marking user as voted:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'Vote successfully cast!' });
      });
    });
  });
});

// Add a new candidate
app.post('/api/candidates', (req, res) => {
  const { name, age, party, qualification } = req.body;

  if (age < 18) {
    return res.status(400).json({ error: 'Candidate must be at least 18 years old' });
  }

  const insertQuery = 'INSERT INTO candidates (name, age, party, qualification, votes) VALUES (?, ?, ?, ?, 0)';
  db.query(insertQuery, [name, age, party, qualification], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Candidate registered successfully' });
  });
});

// Endpoint to check voter status
// Endpoint to check voter status



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
