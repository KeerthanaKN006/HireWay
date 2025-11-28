import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, FileText } from 'lucide-react';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please upload a resume');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('coverLetter', coverLetter);

    try {
      await api.post(`/jobs/apply/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Application Sent!');
      navigate('/dashboard');
    } catch (err) {
      alert('Application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Submit Your Application</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume / CV</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
              <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-primary font-medium">{file ? file.name : 'Click to Upload Resume'}</span>
                <span className="text-xs text-gray-500 mt-1">PDF, DOCX up to 5MB</span>
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
            <textarea
              className="w-full border rounded-md p-3 focus:ring-primary focus:border-primary"
              rows={4}
              placeholder="Why are you a good fit?"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;