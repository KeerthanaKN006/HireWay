import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Job } from '../../types';
import { Trash2, PlusCircle, Users, Briefcase, FileText, ArrowRight, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
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
    <div className="min-h-screen bg-[#F5F5DC] p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">Admin Portal</h1>
            <p className="text-gray-600 mt-2 font-medium">Overview of platform performance and hiring pipelines.</p>
          </div>
          <Link to="/admin/add-job" className="mt-4 md:mt-0 bg-primary text-[#F5F5DC] px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-xl hover:bg-[#600000] transition-all duration-300 transform hover:-translate-y-1">
            <PlusCircle className="mr-2 h-5 w-5" /> Post New Job
          </Link>
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: ANALYTICS SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Traffic</h3>
                <BarChart2 className="w-5 h-5 text-primary/40" />
              </div>
              <div className="space-y-6">
                
                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-gray-600 font-medium">Users</span>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 ml-11">{stats.totalUsers}</p>
                </div>

                <div className="w-full h-px bg-gray-200"></div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-gray-600 font-medium">Active Jobs</span>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 ml-11">{stats.totalJobs}</p>
                </div>

                <div className="w-full h-px bg-gray-200"></div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-gray-600 font-medium">Applications</span>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 ml-11">{stats.totalApplications}</p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: JOB LIST */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Manage Listings</h2>
              </div>
              
              <div className="divide-y divide-gray-50">
                {jobs.map((job) => (
                  <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors group flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{job.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" /> {job.company}
                        <span className="mx-2 text-gray-300">|</span>
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => navigate(`/admin/job/${job._id}/applicants`)}
                        className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-primary hover:text-primary transition-all duration-300"
                      >
                        <Users className="w-4 h-4 mr-2" /> Applicants
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(job._id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                ))}
                
                {jobs.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    No active jobs found. Post one to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;