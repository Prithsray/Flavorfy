const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Path to the JSON file containing user data
const dataPath = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Login Route
router.post('/', (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  // Find user by email
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check password
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

  // Send response
  res.json({ token });
});

module.exports = router;
