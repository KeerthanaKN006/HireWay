import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Briefcase, MapPin, DollarSign, FileText, CheckSquare, Plus } from 'lucide-react';

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time', 
    salary: '', description: '', requirements: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map(s => s.trim())
      };
      await api.post('/jobs', payload);
      alert('Job Posted Successfully');
      navigate('/admin');
    } catch (err) {
      alert('Error posting job');
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

      <div className="min-h-screen animate-maroon-bg p-6 md:p-12 flex items-center justify-center relative">
        
        {/* Back Button (Floating) */}
        <button 
          onClick={() => navigate('/admin')}
          className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Dashboard
        </button>

        <div className="max-w-3xl w-full bg-[#F5F5DC] rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-primary">Create New Position</h1>
              <p className="text-gray-500 text-sm">Fill in the details to publish a new job opening.</p>
            </div>
            <div className="hidden sm:flex bg-primary/10 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <Briefcase className="w-3 h-3 mr-1.5" /> Job Title
                </label>
                <input name="title" required onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800" placeholder="e.g. Senior Product Designer" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <Briefcase className="w-3 h-3 mr-1.5" /> Company
                </label>
                <input name="company" required onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800" placeholder="e.g. Acme Corp" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <MapPin className="w-3 h-3 mr-1.5" /> Location
                </label>
                <input name="location" required onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800" placeholder="Remote / NY" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <Briefcase className="w-3 h-3 mr-1.5" /> Type
                </label>
                <div className="relative">
                  <select name="type" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800 appearance-none">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <DollarSign className="w-3 h-3 mr-1.5" /> Salary
                </label>
                <input name="salary" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800" placeholder="$80k - $120k" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <FileText className="w-3 h-3 mr-1.5" /> Job Description
              </label>
              <textarea name="description" required rows={5} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800" placeholder="Describe the role, responsibilities, and perks..." />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <CheckSquare className="w-3 h-3 mr-1.5" /> Requirements (Comma Separated)
              </label>
              <input name="requirements" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800" placeholder="React, Node.js, TypeScript, 3+ Years Exp" />
            </div>

            <button type="submit" className="w-full bg-primary text-[#F5F5DC] py-4 rounded-xl font-extrabold text-lg hover:bg-[#600000] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" /> Publish Job Listing
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddJob;