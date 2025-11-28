import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// New Interface for Application Data
interface Application {
  _id: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Waitlisted';
  job: Job; 
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Application[]>([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'saved' | 'applied'>('saved');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/jobs/user/dashboard');
        setSavedJobs(res.data.saved);
        setAppliedJobs(res.data.applied);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Shortlisted': return <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"><CheckCircle className="w-4 h-4 mr-2"/> Shortlisted</span>;
      case 'Rejected': return <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"><XCircle className="w-4 h-4 mr-2"/> Rejected</span>;
      case 'Waitlisted': return <span className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium"><AlertCircle className="w-4 h-4 mr-2"/> Waitlisted</span>;
      default: return <span className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium"><Clock className="w-4 h-4 mr-2"/> Pending</span>;
    }
  };

  // --- NEW: Visual Timeline Component ---
  const Timeline = ({ status }: { status: string }) => {
    const isRejected = status === 'Rejected';
    const isShortlisted = status === 'Shortlisted';
    
    // Logic: 
    // Step 1 (Applied): Always green
    // Step 2 (Review): Green if not Pending (meaning admin touched it)
    // Step 3 (Decision): Green if Shortlisted, Red if Rejected, Gray if Pending/Waitlisted
    
    return (
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Applied</span>
          <span>Review</span>
          <span>Decision</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden flex">
          {/* Step 1: Applied */}
          <div className="w-1/3 bg-green-500 h-full"></div>
          
          {/* Step 2: Review (Active if status isn't just 'Pending') */}
          <div className={`w-1/3 h-full border-l border-white ${
            status !== 'Pending' ? 'bg-green-500' : 'bg-gray-200'
          }`}></div>
          
          {/* Step 3: Decision */}
          <div className={`w-1/3 h-full border-l border-white ${
            isShortlisted ? 'bg-green-500' : 
            isRejected ? 'bg-red-500' : 
            'bg-gray-200'
          }`}></div>
        </div>

        {/* Status Text */}
        <p className="text-right text-xs mt-2 font-medium">
          Current Stage: <span className={`${
            isShortlisted ? 'text-green-600' : 
            isRejected ? 'text-red-600' : 
            'text-primary'
          }`}>{status}</span>
        </p>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Manage your job search progress here.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applied'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Applied Jobs ({appliedJobs.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* === SAVED JOBS TAB (Standard JobCards) === */}
        {activeTab === 'saved' && (
          savedJobs.length > 0 ? (
            savedJobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed">
              You haven't saved any jobs yet.
            </div>
          )
        )}

        {/* === APPLIED JOBS TAB (Custom Cards with Status) === */}
        {activeTab === 'applied' && (
          appliedJobs.length > 0 ? (
            appliedJobs.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                
                {/* Status Header */}
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Job Info */}
                <h3 className="text-lg font-semibold text-gray-900">{app.job.title}</h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <Building2 className="h-4 w-4 mr-1" /> {app.job.company}
                </p>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" /> {app.job.location}
                </div>

                {/* --- NEW: Visual Timeline --- */}
                <Timeline status={app.status} />

                {/* View Button */}
                <div className="mt-4">
                  <Link 
                    to={`/jobs/${app.job._id}`}
                    className="w-full block text-center bg-gray-50 border border-gray-200 text-gray-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    View Job Description
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed">
              You haven't applied to any jobs yet.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;