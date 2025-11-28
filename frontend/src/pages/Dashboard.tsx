import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
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
        {activeTab === 'saved' ? (
          savedJobs.length > 0 ? (
            savedJobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p className="text-gray-500">You haven't saved any jobs yet.</p>
          )
        ) : (
          appliedJobs.length > 0 ? (
            appliedJobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;