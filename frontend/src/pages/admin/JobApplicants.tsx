import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, FileText, Download } from 'lucide-react';

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
      // Update UI locally to reflect change immediately
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: status as any } : app
      ));
      alert(`Candidate marked as ${status}. Email notification sent.`);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // --- NEW: EXPORT TO CSV FUNCTION ---
  const downloadCSV = () => {
    if (applications.length === 0) return alert("No data to export");

    // 1. Define Headers
    const headers = ["Candidate Name", "Email", "Status", "Applied Date", "Resume Link", "Cover Letter"];
    
    // 2. Map Data to Rows
    const rows = applications.map(app => [
      `"${app.user.name}"`, // Quote names to handle commas
      app.user.email,
      app.status,
      new Date(app.createdAt).toLocaleDateString(),
      `http://localhost:5000/${app.resume}`, // Full link to resume
      `"${(app.coverLetter || '').replace(/"/g, '""')}"` // Escape quotes in cover letter
    ]);

    // 3. Combine into CSV String
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 4. Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${jobTitle.replace(/\s+/g, '_')}_applicants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Status Badge Styling
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
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/admin')} className="text-gray-600 hover:text-primary flex items-center transition">
          <ArrowLeft className="w-4 h-4 mr-2"/> Back to Dashboard
        </button>
        
        {/* Export Button */}
        <button 
          onClick={downloadCSV}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 mt-1">Manage candidates for <span className="font-semibold text-primary">{jobTitle}</span></p>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading applicants...</div>
        ) : (
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
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition">
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
                        className="text-primary hover:underline flex items-center font-medium"
                      >
                        <FileText className="w-4 h-4 mr-1"/> View Resume
                      </a>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => updateStatus(app._id, 'Shortlisted')} className="text-green-600 hover:text-green-900 text-xs font-bold border border-green-200 px-2 py-1 rounded transition hover:bg-green-50">Approve</button>
                      <button onClick={() => updateStatus(app._id, 'Waitlisted')} className="text-gray-600 hover:text-gray-900 text-xs font-bold border border-gray-200 px-2 py-1 rounded transition hover:bg-gray-50">Waitlist</button>
                      <button onClick={() => updateStatus(app._id, 'Rejected')} className="text-red-600 hover:text-red-900 text-xs font-bold border border-red-200 px-2 py-1 rounded transition hover:bg-red-50">Reject</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">
                    No applicants found for this job yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;