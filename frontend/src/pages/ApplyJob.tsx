import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, FileText, Send, ArrowLeft } from 'lucide-react';

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
    <>
      <style>{`
        @keyframes maroon-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-maroon-bg {
          background: linear-gradient(-45deg, #800000, #5a0000, #900c0c, #4a0404);
          background-size: 400% 400%;
          animation: maroon-move 15s ease infinite;
        }
      `}</style>

      <div className="min-h-screen animate-maroon-bg flex items-center justify-center p-4 relative">
        {/* Floating Background Element */}
        <div className="absolute top-10 left-10 text-white/10 opacity-20 pointer-events-none">
           <Send className="w-64 h-64 rotate-12" />
        </div>

        <div className="bg-[#F5F5DC] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10">
          <div className="bg-white p-8 pb-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-primary mb-4 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-extrabold text-primary mb-1">Make your move.</h1>
            <p className="text-gray-500 text-sm">Submit your application for this role.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Unique Resume Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resume / CV</label>
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${file ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-white'}`}>
                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" id="resume-upload" />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  {file ? (
                    <>
                      <FileText className="h-10 w-10 text-primary mb-2" />
                      <span className="text-primary font-bold">{file.name}</span>
                      <span className="text-xs text-primary/60 mt-1">Click to change</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-gray-600 font-medium">Drop your resume here</span>
                      <span className="text-xs text-gray-400 mt-1">or click to browse (PDF, DOCX)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cover Letter (Optional)</label>
              <textarea
                className="w-full bg-white border-transparent focus:border-primary rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-gray-700 placeholder-gray-400"
                rows={4}
                placeholder="Tell us why you are the perfect fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-[#600000] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>Send Application <Send className="ml-2 w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplyJob;