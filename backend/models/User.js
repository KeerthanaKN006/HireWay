import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // --- NEW PROFILE FIELDS ---
  title: { type: String }, // e.g., "Senior React Developer"
  bio: { type: String },
  phone: { type: String },
  
  // Existing fields...
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);