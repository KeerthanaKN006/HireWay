import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, FileText, Download, Check, X, Clock, User, Mail, Calendar, Briefcase } from 'lucide-react';

interface Application {
  _id: string;
  user: { name: string; email: string };
  resume: string;
  coverLetter: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Waitlisted';
  createdAt: string;
}

const JobApplicants = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applicants`);
        setApplications(res.data.applications);
        setJobTitle(res.data.jobTitle);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [id]);

  const updateStatus = async (appId: string, status: string) => {
    if (!window.confirm(`Mark this candidate as ${status}?`)) return;
    try {
      await api.patch(`/jobs/application/${appId}/status`, { status });
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: status as any } : app
      ));
      alert(`Candidate marked as ${status}.`);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const downloadCSV = () => {
    if (applications.length === 0) return alert("No data to export");
    const headers = ["Candidate Name", "Email", "Status", "Applied Date", "Resume Link", "Cover Letter"];
    const rows = applications.map(app => [
      `"${app.user.name}"`,
      app.user.email,
      app.status,
      new Date(app.createdAt).toLocaleDateString(),
      `http://localhost:5000/${app.resume}`,
      `"${(app.coverLetter || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${jobTitle.replace(/\s+/g, '_')}_applicants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Waitlisted': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-primary flex items-center transition-colors text-sm font-bold uppercase tracking-wider mb-2">
              <ArrowLeft className="w-4 h-4 mr-2"/> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
              Applicants
            </h1>
            <p className="text-gray-600 font-medium flex items-center mt-1">
              <Briefcase className="w-4 h-4 mr-2 opacity-60" /> {jobTitle}
            </p>
          </div>
          
          <button 
            onClick={downloadCSV}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-center"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-primary font-bold animate-pulse">LOADING CANDIDATES...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-16 text-center border border-white">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Applicants Yet</h3>
            <p className="text-gray-500">Wait for candidates to apply to this position.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
                
                {/* Card Header */}
                <div className="p-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mr-4">
                      {app.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{app.user.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 font-medium mt-0.5">
                        <Calendar className="w-3 h-3 mr-1" /> {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="px-6 py-2 flex-grow space-y-3">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{app.user.email}</span>
                  </div>
                  
                  {app.coverLetter && (
                    <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100 line-clamp-3">
                      "{app.coverLetter}"
                    </div>
                  )}
                </div>

                {/* Card Footer (Actions) */}
                <div className="p-6 pt-4 mt-auto">
                  <a 
                    href={`http://localhost:5000/${app.resume}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 py-3 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all mb-4"
                  >
                    <FileText className="w-4 h-4 mr-2" /> View Resume
                  </a>

                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => updateStatus(app._id, 'Shortlisted')}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors group/btn"
                      title="Shortlist"
                    >
                      <Check className="w-5 h-5 mb-1 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase">Approve</span>
                    </button>
                    
                    <button 
                      onClick={() => updateStatus(app._id, 'Waitlisted')}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors group/btn"
                      title="Waitlist"
                    >
                      <Clock className="w-5 h-5 mb-1 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase">Wait</span>
                    </button>

                    <button 
                      onClick={() => updateStatus(app._id, 'Rejected')}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors group/btn"
                      title="Reject"
                    >
                      <X className="w-5 h-5 mb-1 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase">Reject</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;