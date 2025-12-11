import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // --- RESUME & PARSED DATA ---
  resume: { type: String }, // Path to file
  skills: [{ type: String }], // Extracted from resume (e.g. ['React', 'Node'])
  rawResumeText: { type: String }, // Full text for AI analysis later
  
  // Existing fields...
  title: { type: String },
  bio: { type: String },
  phone: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);