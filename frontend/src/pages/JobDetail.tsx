import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Briefcase, DollarSign, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

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
    } catch (err) { alert('Error'); }
  };

  const handleApply = () => {
    if (!isAuthenticated) return navigate('/login');
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) return <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">Loading...</div>;
  if (!job) return <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">Job not found</div>;

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      
      {/* --- HERO HEADER (Maroon) --- */}
      <div className="bg-primary text-[#F5F5DC] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
           <Building2 className="w-96 h-96 -translate-y-1/2 translate-x-1/4" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center text-[#F5F5DC]/70 hover:text-white mb-6 transition">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{job.title}</h1>
              <div className="flex flex-wrap gap-6 text-[#F5F5DC]/90 font-medium">
                <span className="flex items-center"><Building2 className="h-5 w-5 mr-2 opacity-70" /> {job.company}</span>
                <span className="flex items-center"><MapPin className="h-5 w-5 mr-2 opacity-70" /> {job.location}</span>
                <span className="flex items-center"><Briefcase className="h-5 w-5 mr-2 opacity-70" /> {job.type}</span>
              </div>
            </div>
            
            {applied && (
              <span className="bg-[#F5F5DC] text-primary px-6 py-2 rounded-full font-bold flex items-center shadow-lg">
                <CheckCircle className="h-5 w-5 mr-2" /> Applied
              </span>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT CARD (Floating Up) --- */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          
          <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-gray-100">
             {job.salary && (
               <div className="bg-[#F5F5DC] px-6 py-3 rounded-2xl flex items-center text-primary font-bold">
                 <DollarSign className="w-5 h-5 mr-2" /> {job.salary}
               </div>
             )}
             <div className="bg-gray-50 px-6 py-3 rounded-2xl flex items-center text-gray-500 font-medium">
               <Clock className="w-5 h-5 mr-2" /> Posted {new Date(job.createdAt).toLocaleDateString()}
             </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Role</h2>
          <p className="text-gray-600 leading-loose text-lg mb-12 whitespace-pre-line">
            {job.description}
          </p>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
              <ul className="grid gap-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start text-gray-700 text-lg">
                    <div className="mt-2 w-2 h-2 rounded-full bg-primary mr-4 flex-shrink-0"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleApply}
              disabled={applied}
              className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1 ${
                applied 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-[#600000]'
              }`}
            >
              {applied ? 'Application Submitted' : 'Apply Now'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saved}
              className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition ${
                saved
                  ? 'bg-gray-50 text-gray-400 border-gray-200'
                  : 'border-primary text-primary hover:bg-primary/5'
              }`}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;