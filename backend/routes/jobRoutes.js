import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer'; 
import Job from '../models/job.js';
import User from '../models/User.js';
import Application from '../models/Application.js'; 
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Clean the filename to avoid spaces/issues
    const cleanName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${req.user.id}-${Date.now()}-${cleanName}`);
  },
});
const upload = multer({ storage });

// --- ADMIN CHECK ---
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied' });
};

// ================= ROUTES =================

// 1. Get All Jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// 2. Get Single Job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Not Found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching job' });
  }
});

// 3. APPLY TO JOB (With Resume)
router.post('/apply/:id', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    if (!req.file) return res.status(400).json({ message: 'Resume file is required' });

    // Check if already applied
    const existingApp = await Application.findOne({ user: userId, job: jobId });
    if (existingApp) return res.status(400).json({ message: 'Already applied' });

    // Create Application
    const application = new Application({
      user: userId,
      job: jobId,
      resume: req.file.path, 
      coverLetter: req.body.coverLetter,
    });
    await application.save();

    // Add to User's applied list
    await User.findByIdAndUpdate(userId, { $push: { appliedJobs: jobId } });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 4. ADMIN: Get Applicants
router.get('/:id/applicants', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const applications = await Application.find({ job: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ jobTitle: job.title, applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// 5. ADMIN: Update Status & Send Email
router.patch('/application/:appId/status', authMiddleware, checkAdmin, async (req, res) => {
  const { status } = req.body; 
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.appId, 
      { status }, 
      { new: true }
    ).populate('user').populate('job');

    // --- FIX: DEFINE TRANSPORTER INSIDE THE ROUTE ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    // Send Email Notification
    const mailOptions = {
      from: `"HireWay Admin" <${process.env.EMAIL_USER}>`,
      to: app.user.email,
      subject: `Application Update: ${app.job.title}`,
      text: `Hello ${app.user.name},\n\nYour application status for ${app.job.title} has been updated to: ${status}.\n\nBest,\nHireWay Team`,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${app.user.email}`);

    res.json(app);
  } catch (err) {
    console.error("Status Update/Email Error:", err);
    // Don't crash if email fails, just return the updated status
    res.status(200).json({ message: "Status updated (Email might have failed)" }); 
  }
});

// 6. ADMIN Routes (Create/Delete)
router.post('/', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.delete('/:id', authMiddleware, checkAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// 7. USER: Dashboard Data
router.get('/user/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedJobs');
    const applications = await Application.find({ user: req.user.id }).populate('job');
    
    res.json({ 
      saved: user.savedJobs, 
      applied: applications 
    });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard error' });
  }
});

// 8. USER: Save Job
router.post('/save/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedJobs.includes(req.params.id)) {
      user.savedJobs.push(req.params.id);
      await user.save();
    }
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/admin/stats', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isVerified: true }); // Only verified
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    // Simple "Applications per Status" breakdown
    const statusBreakdown = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      statusBreakdown
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;