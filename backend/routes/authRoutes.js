import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

// NOTE: Transporter creation is moved INSIDE the route to ensure .env is loaded

// 1. Signup (Send OTP)
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update or Create User
    if (user && !user.isVerified) {
      user.password = hashedPassword;
      user.name = name;
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      user = new User({ 
        name, 
        email, 
        password: hashedPassword,
        otp,
        otpExpires
      });
    }

    await user.save();

    // --- EMAIL SETUP STARTS HERE (Inside the function) ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Now this will be loaded correctly
      },
    });

    await transporter.sendMail({
      from: `"JobHunt Lite" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your account',
      text: `Your OTP code is: ${otp}`,
    });
    // --- EMAIL SETUP ENDS HERE ---

    res.status(200).json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Normal user token
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token, 
      role: 'user',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        savedJobs: user.savedJobs, 
        appliedJobs: user.appliedJobs 
      } 
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// 3. Login (UPDATED FOR ADMIN)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // --- 1. ADMIN CHECK ---
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      // Create Admin Token
      const token = jwt.sign(
        { id: 'admin-id', role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      return res.json({ 
        token, 
        role: 'admin', 
        user: { name: 'Admin', email: email } 
      });
    }

    // --- 2. NORMAL USER CHECK ---
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

    // Create User Token (with role: user)
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token, 
      role: 'user',
      user: { id: user._id, name: user.name, email, savedJobs: user.savedJobs, appliedJobs: user.appliedJobs } 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;