import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Briefcase, DollarSign, Clock, CheckCircle } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        
        // If user is logged in, check if they already saved/applied
        if (user) {
          setSaved(user.savedJobs.includes(id!));
          setApplied(user.appliedJobs.includes(id!));
        }
      } catch (err) {
        console.error('Error fetching job', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleSave = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await api.post(`/jobs/save/${id}`);
      setSaved(true);
      alert('Job Saved!');
    } catch (err) {
      alert('Error saving job');
    }
  };

  // --- CHANGED: Navigate to Apply Page instead of immediate API call ---
  const handleApply = () => {
    if (!isAuthenticated) return navigate('/login');
    // Navigate to the Resume Upload Page
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) return <div className="p-10 text-center">Loading Job Details...</div>;
  if (!job) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center mt-2 text-lg text-primary font-medium">
                <Building2 className="h-5 w-5 mr-2" /> {job.company}
              </div>
            </div>
            {applied && (
              <span className="flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" /> Applied
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-gray-600">
            <span className="flex items-center"><MapPin className="h-5 w-5 mr-2" /> {job.location}</span>
            <span className="flex items-center"><Briefcase className="h-5 w-5 mr-2" /> {job.type}</span>
            {job.salary && <span className="flex items-center"><DollarSign className="h-5 w-5 mr-2" /> {job.salary}</span>}
            <span className="flex items-center"><Clock className="h-5 w-5 mr-2" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
            <button
              onClick={handleApply}
              disabled={applied}
              className={`flex-1 py-3 px-6 rounded-md font-bold text-lg shadow transition ${
                applied 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-primary text-white hover:bg-indigo-700'
              }`}
            >
              {applied ? 'Applied' : 'Apply Now'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saved}
              className={`px-8 py-3 rounded-md font-bold text-lg border transition ${
                saved
                  ? 'bg-gray-100 text-gray-500 border-gray-200'
                  : 'border-primary text-primary hover:bg-indigo-50'
              }`}
            >
              {saved ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;