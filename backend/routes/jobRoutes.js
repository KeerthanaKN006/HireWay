import express from 'express';
import Job from '../models/job.js'; // Ensure filename matches (Job.js vs job.js)
import User from '../models/User.js';
import authMiddleware from '../middleware/authmiddleware.js'; // Ensure filename matches

const router = express.Router();

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

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
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

router.get('/:id/applicants', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    
    const applicants = await User.find({ appliedJobs: req.params.id })
                                 .select('name email createdAt');
  
    res.json({
      jobTitle: job.title,
      applicants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

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

router.post('/apply/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.appliedJobs.includes(req.params.id)) {
      user.appliedJobs.push(req.params.id);
      await user.save();
    }
    res.json(user.appliedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedJobs')
      .populate('appliedJobs');
    res.json({ saved: user.savedJobs, applied: user.appliedJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;