import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js'; // Import the Prisma Client
import { generateOtp, sendOtpEmail } from '../utils/otpMailer.js'; // Import the OTP mail functions

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
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

export default router;
