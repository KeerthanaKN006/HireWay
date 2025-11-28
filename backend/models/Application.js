import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true }, // Path to the file
  coverLetter: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Shortlisted', 'Rejected', 'Waitlisted'], 
    default: 'Pending' 
  },
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);