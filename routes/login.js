const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Import the Prisma Client

const router = express.Router();

// Login Route
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send response with token and user information
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
