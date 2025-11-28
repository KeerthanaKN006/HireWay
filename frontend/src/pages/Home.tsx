import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = jobType === 'All' || job.type === jobType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Find your dream job</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title or company..."
              className="pl-10 block w-full border-gray-300 rounded-md border py-2 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative min-w-[200px]">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 block w-full border-gray-300 rounded-md border py-2 focus:ring-primary focus:border-primary bg-white"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="text-center py-10">Loading jobs...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center">No jobs found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;