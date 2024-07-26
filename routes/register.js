const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to the users JSON file
const dataPath = path.join(__dirname, '../data/users.json');
let users = [];

// Load existing users from the file
if (fs.existsSync(dataPath)) {
  users = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// POST a new user registration
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
    console.log(name);
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password // In a real-world application, you should hash passwords before storing
  };

  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf-8');
  res.status(201).json(newUser);
});

module.exports = router;
