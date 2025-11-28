import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // Full-time, Part-time, etc.
  description: { type: String, required: true },
  requirements: [String], // Array of strings
  salary: String,
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);