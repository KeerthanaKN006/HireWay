import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../api/axios';
import { Job } from '../../types';
import { Trash2, PlusCircle, Building2, Users } from 'lucide-react'; // Import Users icon

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
        <Link to="/admin/add-job" className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          <PlusCircle className="mr-2 h-5 w-5" /> Post New Job
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Building2 className="h-4 w-4 mr-1" /> {job.company}
                  <span className="mx-2">•</span>
                  {job.type}
                  <span className="mx-2">•</span>
                  <span className="text-xs text-gray-400">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* NEW: View Applicants Button */}
                <button
                  onClick={() => navigate(`/admin/job/${job._id}/applicants`)}
                  className="flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 px-3 py-2 rounded-md transition"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applicants
                </button>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(job._id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                  title="Delete Job"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;