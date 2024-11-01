import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js'; // Import the Prisma Client
import { generateOtp, sendOtpEmail } from '../utils/otpMailer.js'; // Import the OTP mail functions
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

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

        // Check if the user is active
        if (user.isActive === false) {
            // Generate OTP
            const otp = generateOtp();

            // Update the user's OTP in the database
            await prisma.user.update({
                where: { email },
                data: {
                    otp: otp // Update the OTP field for the user
                }
            });

            // Send OTP to the user's email
            await sendOtpEmail(email, otp);

            return res.status(403).json({
                message: 'Your account is not active. An OTP has been sent to your email to activate your account.'
            });
        }

        // Compare the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token using the secret from the environment variable
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with token and user information
        res.json({
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and send it to the user's email
    const otp = generateOtp();
    await sendOtpEmail(email, otp);
    await prisma.user.update({
        where: { email },
        data: {
          otp: otp,
           // OTP valid for 10 minutes
        },
      });
    // Store the OTP in the database or in memory (for demonstration, we're not storing it)
    // You could create a temporary OTP model or store it in the user's record.
    
    // You may want to set an expiration time for the OTP here.

    res.status(200).json({ message: 'OTP sent to your email.' });
} catch (error) {
  return res.status(500).json({ message: 'Internal server error.' });
}
});




router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    try {
      // Find the user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the OTP is valid and not expired
      if (user.otp !== otp ) {
        return res.status(400).json({ message: 'Invalid OTP.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password and clear the OTP
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword, // Update the password
          otp: null,               // Clear the OTP
              // Clear the expiration time
        },
      });
  
      res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });

export default router;
