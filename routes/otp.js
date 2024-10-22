// otpVerification.js
const express = require('express');
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const { generateOtp, sendOtpEmail } = require('../utils/otpMailer'); // Import the new module
const router = express.Router();

// POST verify OTP
router.post('/', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Activate the user account by setting isActive to true
        await prisma.user.update({
            where: { email },
            data: {
                isActive: true,
                otp: null // Clear the OTP after successful verification
            }
        });

        res.status(200).json({ message: 'OTP verified successfully! Your account is now active.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new OTP
        const newOtp = generateOtp();

        // Update the user's OTP in the database
        await prisma.user.update({
            where: { email },
            data: {
                otp: newOtp // Update the OTP
            }
        });

        // Send new OTP to the user's email
        await sendOtpEmail(email, newOtp);

        res.status(200).json({ message: 'New OTP sent successfully! Please check your email.' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Error resending OTP' });
    }
});

module.exports = router;
