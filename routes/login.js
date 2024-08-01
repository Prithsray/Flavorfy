const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Import the Prisma Client

const router = express.Router();

// Login Route
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email using Prisma
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

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
