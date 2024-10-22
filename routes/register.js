const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const prisma = require('../prismaClient');
const { generateOtp, sendOtpEmail } = require('../utils/otpMailer');
const router = express.Router();


console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS);




// POST register a new user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();
    
    // Create the new user with OTP and inactive state
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        bio: "None",
        otp, // Store the OTP in the database
        isActive: false // User is inactive until OTP verification
      }
    });
    
    // Send OTP to the user's email
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: 'User registered successfully! Please check your email for the OTP.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// POST resend OTP


module.exports = router;
