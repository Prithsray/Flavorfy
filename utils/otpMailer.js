// otpMailer.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateOtp = () => {
    return crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP
};

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
        tls: {
            rejectUnauthorized: false, // Ignore certificate errors
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Flavorfy Account Verification and Activation',
        text: `Your OTP is ${otp}. Please enter this to verify your account.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error; // Re-throw error for further handling if needed
    }
};

module.exports = { generateOtp, sendOtpEmail };
