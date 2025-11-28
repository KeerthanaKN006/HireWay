import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

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

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applicants`);
        setApplications(res.data.applications);
        setJobTitle(res.data.jobTitle);
      } catch (err) { console.error(err); }
    };
    fetchApps();
  }, [id]);

  const updateStatus = async (appId: string, status: string) => {
    if(!window.confirm(`Mark this candidate as ${status}?`)) return;
    try {
      await api.patch(`/jobs/application/${appId}/status`, { status });
      // Update UI locally
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: status as any } : app
      ));
      alert(`Candidate ${status}! Email sent.`);
    } catch (err) { alert('Failed to update'); }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Shortlisted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Waitlisted: "bg-gray-100 text-gray-800"
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status as keyof typeof styles]}`}>{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/admin')} className="text-gray-600 mb-6 flex items-center"><ArrowLeft className="w-4 h-4 mr-2"/> Back</button>
      <h1 className="text-3xl font-bold mb-6">Applicants for {jobTitle}</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{app.user.name}</div>
                  <div className="text-sm text-gray-500">{app.user.email}</div>
                  {app.coverLetter && <div className="text-xs text-gray-400 mt-1 italic">"{app.coverLetter.substring(0,30)}..."</div>}
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={`http://localhost:5000/${app.resume}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1"/> View Resume
                  </a>
                </td>
                <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => updateStatus(app._id, 'Shortlisted')} className="text-green-600 hover:text-green-900 text-xs font-bold border border-green-200 px-2 py-1 rounded">Approve</button>
                  <button onClick={() => updateStatus(app._id, 'Waitlisted')} className="text-gray-600 hover:text-gray-900 text-xs font-bold border border-gray-200 px-2 py-1 rounded">Waitlist</button>
                  <button onClick={() => updateStatus(app._id, 'Rejected')} className="text-red-600 hover:text-red-900 text-xs font-bold border border-red-200 px-2 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <div className="p-10 text-center text-gray-500">No applicants yet.</div>}
      </div>
    </div>
  );
};

export default JobApplicants;