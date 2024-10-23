const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
const router = express.Router();
const prisma = require('../prismaClient');
require('dotenv').config(); // Load environment variables

// Set up Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file uploads (in-memory storage to stream directly to Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// GET profile data
router.get('/', async (req, res) => {
  const email = req.headers.email.replace(/"/g, ''); // Retrieve email from headers
  console.log(email);

  try {
    const user = await prisma.user.findUnique({
      where: { email }, // Use email to find the user
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

  // If a new profile picture was uploaded, upload to Cloudinary and save the URL
  if (req.file) {
    console.log(req.file);

    try {
      // Upload the file to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'profiles', // Optionally specify a folder in Cloudinary
            resource_type: 'image', // Specify the resource type
          },
          (error, result) => {
            if (error) {
              return reject(new Error('Error uploading to Cloudinary: ' + error.message));
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer); // Pipe the file buffer to the upload stream
      });

      // Set the profile picture URL in the update data
      updateData.profilePicture = uploadResult.secure_url;
    } catch (error) {
      console.error('Error uploading profile picture to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading profile picture' });
    }
  }

  console.log(email);

  try {
    // Update the user profile in the database
    const user = await prisma.user.update({
      where: { email }, // Use email to update the user
      data: updateData, // Update the bio and profile picture URL if present
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
