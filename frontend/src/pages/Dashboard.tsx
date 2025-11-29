import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

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
        
        // FIXED: Filter out items where 'job' is null (deleted jobs)
        const validSaved = (res.data.saved || []).filter((job: Job | null) => job !== null);
        const validApplied = (res.data.applied || []).filter((app: Application) => app.job !== null);
        
        setSavedJobs(validSaved);
        setAppliedJobs(validApplied);
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
      case 'Shortlisted': return <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200"><CheckCircle className="w-3 h-3 mr-1.5"/> Shortlisted</span>;
      case 'Rejected': return <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-red-200"><XCircle className="w-3 h-3 mr-1.5"/> Rejected</span>;
      case 'Waitlisted': return <span className="flex items-center text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-orange-200"><AlertCircle className="w-3 h-3 mr-1.5"/> Waitlisted</span>;
      default: return <span className="flex items-center text-primary bg-[#F5F5DC] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-primary/20"><Clock className="w-3 h-3 mr-1.5"/> Pending</span>;
    }
  };

  const Timeline = ({ status }: { status: string }) => {
    const isRejected = status === 'Rejected';
    const isShortlisted = status === 'Shortlisted';
    
    return (
      <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span>Applied</span>
          <span>Review</span>
          <span>Decision</span>
        </div>
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="w-1/3 bg-primary h-full"></div>
          <div className={`w-1/3 h-full border-l border-white ${status !== 'Pending' ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`w-1/3 h-full border-l border-white ${isShortlisted ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center text-primary font-bold text-lg tracking-widest animate-pulse">LOADING DASHBOARD...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5DC] relative overflow-hidden">
      {/* Decorative BG Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-primary mb-2">Hello, {user?.name}</h1>
          <p className="text-gray-600">Here is the state of your career search.</p>
        </div>

        {/* Unique Tab Design */}
        <div className="flex space-x-2 mb-8 bg-white p-1.5 rounded-xl shadow-sm border border-primary/10 w-fit">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'saved'
                ? 'bg-primary text-[#F5F5DC] shadow-md'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'applied'
                ? 'bg-primary text-[#F5F5DC] shadow-md'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Applied Jobs ({appliedJobs.length})
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {activeTab === 'saved' && (
            savedJobs.length > 0 ? (
              savedJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-primary/20 rounded-3xl bg-white/50">
                <p className="text-primary font-medium">No saved jobs yet.</p>
              </div>
            )
          )}

          {activeTab === 'applied' && (
            appliedJobs.length > 0 ? (
              appliedJobs.map((app) => (
                <div key={app._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-primary/10 group overflow-hidden">
                  <div className="h-2 w-full bg-primary/10 group-hover:bg-primary transition-colors duration-300"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      {getStatusBadge(app.status)}
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{app.job?.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 flex items-center font-medium">
                      <Building2 className="h-4 w-4 mr-1.5" /> {app.job?.company}
                    </p>

                    <div className="mt-3 flex items-center text-xs text-gray-400 font-medium">
                      <MapPin className="h-3 w-3 mr-1" /> {app.job?.location}
                    </div>

                    <Timeline status={app.status} />

                    <div className="mt-5">
                      {/* Only render link if job exists */}
                      {app.job && (
                        <Link 
                          to={`/jobs/${app.job._id}`}
                          className="w-full flex items-center justify-center text-sm font-bold text-primary bg-[#F5F5DC] py-3 rounded-xl hover:bg-primary hover:text-[#F5F5DC] transition-all duration-300 group-hover:shadow-md"
                        >
                          View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-primary/20 rounded-3xl bg-white/50">
                <p className="text-primary font-medium">Start applying to build your timeline.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;