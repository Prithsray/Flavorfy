const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET profile data
router.get('/', async (req, res) => {
  const email = req.headers.email.replace(/"/g, '');// Retrieve email from headers
  console.log(email);

  try {
    const user = await prisma.user.findUnique({
      where: {email} // Use email to find the user
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// PUT profile update
router.put('/', async (req, res) => {
  const email = req.headers.email.replace(/"/g, ''); // Retrieve email from headers
  const { bio } = req.body;
  console.log(email);
  
  try {
    const user = await prisma.user.update({
      where: { email }, // Use email to update the user
      data: { bio } // Update the bio
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
     console.log(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
