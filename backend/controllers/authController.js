const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// const registerUser = async (req, res) => {
//     const { firstName, lastName, email, password, role } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({
//             firstName,
//             lastName,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         await user.save();

//         // Send email verification (Simplified, adjust for your needs)
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.PASSWORD,
//             },
//         });

//         const mailOptions = {
//             from: process.env.EMAIL,
//             to: email,
//             subject: 'Email Verification',
//             text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${token}`,
//         };

//         transporter.sendMail(mailOptions);

//         res.status(201).json({ message: 'User registered, please verify your email' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// Register user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
        });

        await user.save();

        // Generate verification token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending verification email' });
            }
            console.log('Verification email sent:', info.response);
        });

        res.status(201).json({ message: 'User registered, please verify your email' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify email
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).send('Invalid token');
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Error verifying email:', err);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'You are not allowed to login from here' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, role: user.role });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
};

