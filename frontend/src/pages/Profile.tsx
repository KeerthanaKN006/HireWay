import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User as UserIcon, Mail, Phone, Briefcase, FileText, Save, Cpu } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', title: '', bio: '', phone: ''
  });
  // Add State for Skills
  const [skills, setSkills] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          title: res.data.title || '',
          bio: res.data.bio || '',
          phone: res.data.phone || ''
        });
        // Set Skills from Backend (Parsed from Resume)
        setSkills(res.data.skills || []); 
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', { ...formData, skills }); // Send updated skills too
      alert('Profile Updated Successfully!');
    } catch (err) { alert('Failed to update profile'); }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => setSkills([...skills, ""]);
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Visual Sidebar */}
        <div className="w-full md:w-1/3 bg-[#F5F5DC] p-10 flex flex-col justify-center items-center text-center">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white">
            <span className="text-5xl font-bold text-white">{formData.name.charAt(0).toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">{formData.name}</h2>
          <p className="text-gray-500 font-medium mt-1">{formData.title || "Job Seeker"}</p>
          
          {/* Skills Tag Cloud Preview */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {skills.slice(0, 5).map((skill, i) => (
              <span key={i} className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                {skill}
              </span>
            ))}
            {skills.length > 5 && <span className="text-xs text-gray-400">+{skills.length - 5} more</span>}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 p-10 md:p-14">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-xs font-bold text-gray-400 uppercase mb-2">
                  <UserIcon className="w-3 h-3 mr-1" /> Full Name
                </label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-2 text-gray-900 font-medium transition-colors bg-transparent" 
                />
              </div>
              <div>
                <label className="flex items-center text-xs font-bold text-gray-400 uppercase mb-2">
                  <Briefcase className="w-3 h-3 mr-1" /> Job Title
                </label>
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="e.g. Frontend Dev"
                  className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-2 text-gray-900 font-medium transition-colors bg-transparent" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-xs font-bold text-gray-400 uppercase mb-2">
                  <Mail className="w-3 h-3 mr-1" /> Email
                </label>
                <input 
                  value={formData.email} 
                  disabled 
                  className="w-full border-b-2 border-gray-100 py-2 text-gray-400 cursor-not-allowed bg-transparent" 
                />
              </div>
              <div>
                <label className="flex items-center text-xs font-bold text-gray-400 uppercase mb-2">
                  <Phone className="w-3 h-3 mr-1" /> Phone
                </label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-2 text-gray-900 font-medium transition-colors bg-transparent" 
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-xs font-bold text-gray-400 uppercase mb-2">
                <FileText className="w-3 h-3 mr-1" /> Bio
              </label>
              <textarea 
                name="bio" 
                rows={3}
                value={formData.bio} 
                onChange={handleChange}
                className="w-full bg-gray-50 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>

            {/* --- NEW SKILLS SECTION --- */}
            <div>
              <label className="flex items-center text-xs font-bold text-gray-400 uppercase mb-2">
                <Cpu className="w-3 h-3 mr-1" /> Skills (Parsed from Resume)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <input 
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="bg-transparent text-sm font-medium text-gray-700 outline-none w-20"
                    />
                    <button type="button" onClick={() => removeSkill(index)} className="ml-1 text-gray-400 hover:text-red-500 font-bold">×</button>
                  </div>
                ))}
                <button type="button" onClick={addSkill} className="text-sm text-primary font-bold hover:underline px-2">+ Add Skill</button>
              </div>
            </div>

            <button type="submit" className="mt-4 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-[#600000] hover:shadow-xl transition-all flex items-center">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;