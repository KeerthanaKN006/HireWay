import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react';

interface Applicant {
  _id: string;
  name: string;
  email: string;
  createdAt: string; // Account created date (or we could use current date for simplicity)
}

const JobApplicants = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applicants`);
        setApplicants(res.data.applicants);
        setJobTitle(res.data.jobTitle);
      } catch (err) {
        console.error('Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/admin')}
        className="flex items-center text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 mt-2">
          Showing candidates for <span className="font-semibold text-primary">{jobTitle}</span>
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No applicants yet</h3>
            <p className="text-gray-500">Wait for candidates to apply to this position.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold">
                        {applicant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${applicant.email}`} className="hover:text-primary hover:underline">
                        {applicant.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Today {/* Since we are not storing exact application timestamp in this Lite version, we can say Today or leave blank */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;