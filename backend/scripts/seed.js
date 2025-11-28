import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/job.js';
import connectDB from '../config/db.js';

dotenv.config({ path: './.env' }); // Load env from parent dir if needed, usually just .env in server

const jobs = [
  {
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $110k",
    description: "Looking for a React expert...",
    requirements: ["React", "Tailwind", "TypeScript"]
  },
  {
    title: "Backend Engineer",
    company: "Data Systems",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $130k",
    description: "Node.js and Database optimization...",
    requirements: ["Node.js", "MongoDB", "Express"]
  },
  {
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "London, UK",
    type: "Contract",
    salary: "$50/hr",
    description: "Design beautiful interfaces...",
    requirements: ["Figma", "Adobe XD"]
  },
  // ... Add as many as you like
];

const seedData = async () => {
  await connectDB();
  await Job.deleteMany({}); // Clear old data
  await Job.insertMany(jobs);
  console.log('Jobs Seeded!');
  process.exit();
};

seedData();