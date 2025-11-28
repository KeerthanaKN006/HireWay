import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User } from '../types';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Email is usually read-only
    title: '',
    bio: '',
    phone: ''
  });
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', formData);
      alert('Profile Updated Successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Professional Title</label>
            <input 
              name="title" 
              placeholder="e.g. Senior Frontend Developer"
              value={formData.title} 
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea 
              name="bio" 
              rows={3}
              placeholder="Tell us about yourself..."
              value={formData.bio} 
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Cannot be changed)</label>
            <input 
              value={formData.email} 
              disabled 
              className="mt-1 w-full border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed" 
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-indigo-700">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;