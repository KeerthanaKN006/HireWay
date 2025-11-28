import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Job } from '../../types';
import { Trash2, PlusCircle, Building2, Users, BarChart3, Briefcase, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  // New Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    statusBreakdown: [] as { _id: string, count: number }[]
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/jobs/admin/stats')
        ]);
        setJobs(jobsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ... handleDelete function ...

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* --- NEW: ANALYTICS SECTION --- */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Jobs</p>
            <h3 className="text-2xl font-bold">{stats.totalJobs}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Applications</p>
            <h3 className="text-2xl font-bold">{stats.totalApplications}</h3>
          </div>
        </div>
      </div>

      {/* --- EXISTING: MANAGE JOBS --- */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Manage Jobs</h2>
        <Link to="/admin/add-job" className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          <PlusCircle className="mr-2 h-5 w-5" /> Post New Job
        </Link>
      </div>

      {/* ... Existing Job List Code ... */}
       <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                   {/* ... job details ... */}
                   {job.company}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/admin/job/${job._id}/applicants`)}
                  className="flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 px-3 py-2 rounded-md transition"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applicants
                </button>
                {/* ... delete button ... */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;