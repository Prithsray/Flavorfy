const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const prisma = require('../prismaClient');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append the original file extension
  }
});

const upload = multer({ storage });

// GET profile data
router.get('/', async (req, res) => {
  const email = req.headers.email.replace(/"/g, ''); // Retrieve email from headers
  console.log(email);

  try {
    const user = await prisma.user.findUnique({
      where: { email } // Use email to find the user
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
router.put('/', upload.single('profilePicture'), async (req, res) => {
  const email = req.headers.email.replace(/"/g, ''); // Retrieve email from headers
  const { bio } = req.body;
  
  const updateData = {
    bio,
  };

  // If a new profile picture was uploaded, add it to the update data
  if (req.file) {
    updateData.profilePicture = req.file.path; // Save the file path to the database
  }

  console.log(email);
  
  try {
    const user = await prisma.user.update({
      where: { email }, // Use email to update the user
      data: updateData // Update the bio and potentially the profile picture
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
