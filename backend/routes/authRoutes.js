import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs'; 
import User from '../models/User.js';
import authMiddleware from '../middleware/authmiddleware.js';

// --- ROBUST IMPORT FOR PDF-PARSE ---
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Directly require the library.
const pdfParse = require('pdf-parse');

const router = express.Router();

// --- 1. MULTER SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '-');
    cb(null, `resume-${Date.now()}-${cleanName}`);
  },
});
const upload = multer({ storage });

// --- 2. HELPERS: PARSE RESUME DATA ---

const parseSkillsFromText = (text) => {
  const commonTechSkills = [
    "Javascript", "Python", "Java", "C++", "React", "Node.js", "Express", 
    "MongoDB", "SQL", "HTML", "CSS", "TypeScript", "Angular", "Vue", 
    "AWS", "Docker", "Git", "Figma", "Redux", "Next.js", "Tailwind"
    , "Django", "Flask", "Ruby", "Rails", "PHP", "Laravel",
    "C#", ".NET", "Swift", "Kotlin", "Go", "Rust", "Machine Learning",
    "Data Science", "TensorFlow", "PyTorch", "NLP", "Computer Vision"," C Programmaing","Web Development"
    ,"Mobile App Development","Flutter","React Native"
  ];
  const lowerText = text.toLowerCase();
  return [...new Set(commonTechSkills.filter(skill => lowerText.includes(skill.toLowerCase())))];
};

const parsePhoneFromText = (text) => {
  // Regex to find common phone formats: (123) 456-7890, 123-456-7890, +1 123 456 7890
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0].trim() : "";
};

const parseBioFromText = (text) => {
  // Simple heuristic: Look for "Summary" or "Objective" section
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let bio = "";

  // 1. Try to find a header
  const summaryIndex = lines.findIndex(line => 
    /^(summary|professional summary|profile|objective|about me)/i.test(line)
  );

  if (summaryIndex !== -1 && summaryIndex < lines.length - 1) {
    // Grab the next 2-3 lines after the header
    bio = lines.slice(summaryIndex + 1, summaryIndex + 4).join(". ");
  } else {
    // 2. Fallback: Take the first substantial chunk of text (skipping potential name/contact lines)
    // We assume lines 0-2 might be name/contact, so we peek at line 3+
    const fallbackText = lines.slice(2, 6).join(". ");
    bio = fallbackText;
  }

  // Clean up and limit length
  bio = bio.replace(/[^\w\s.,'-]/g, '').replace(/\s+/g, ' ').trim();
  return bio.length > 300 ? bio.substring(0, 297) + "..." : bio;
};

// --- 3. SIGNUP ROUTE ---
router.post('/signup', upload.single('resume'), async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let resumePath = '';
    let extractedSkills = [];
    let extractedPhone = '';
    let extractedBio = '';
    let rawText = '';

    if (req.file) {
      resumePath = req.file.path;
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        if (req.file.mimetype === 'application/pdf') {
          // Check/Resolve pdfParse function
          const parseFn = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
          
          if (typeof parseFn === 'function') {
             const pdfData = await parseFn(dataBuffer);
             rawText = pdfData.text;
             
             // Extract Data
             extractedSkills = parseSkillsFromText(rawText);
             extractedPhone = parsePhoneFromText(rawText);
             extractedBio = parseBioFromText(rawText);
          }
        } 
      } catch (parseError) {
        console.error("Resume Parsing Error:", parseError);
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare User Data
    const userData = {
      name, 
      email, 
      password: hashedPassword, 
      otp, 
      otpExpires,
      resume: resumePath,
      skills: extractedSkills,
      rawResumeText: rawText,
      // Auto-fill phone and bio if extracted
      phone: extractedPhone || "",
      bio: extractedBio || ""
    };

    if (user && !user.isVerified) {
      // Update existing unverified user
      Object.assign(user, userData);
    } else {
      // Create new user
      user = new User(userData);
    }

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"HireWay Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your account',
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// --- 4. VERIFY OTP ---
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

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, role: 'user', user: { id: user._id, name: user.name, email: user.email, skills: user.skills } });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- 5. LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const token = jwt.sign({ id: 'admin-id', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'admin', user: { name: 'Admin', email: email } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token, role: 'user',
      user: { 
        id: user._id, name: user.name, email: user.email, 
        savedJobs: user.savedJobs, appliedJobs: user.appliedJobs,
        skills: user.skills
      } 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 6. UPDATE PROFILE ---
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, title, bio, phone, skills } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.title = title || user.title;
    user.bio = bio || user.bio;
    user.phone = phone || user.phone;
    
    if (skills) user.skills = skills;

    await user.save();

    res.json({ 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      title: user.title,
      bio: user.bio,
      phone: user.phone,
      skills: user.skills,
      savedJobs: user.savedJobs,
      appliedJobs: user.appliedJobs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- 7. GET PROFILE ---
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;