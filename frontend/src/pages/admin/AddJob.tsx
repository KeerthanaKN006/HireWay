import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow rounded-lg border border-gray-200">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input name="title" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input name="company" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input name="location" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select name="type" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salary</label>
          <input name="salary" placeholder="e.g. $80k - $100k" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" required rows={4} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements (comma separated)</label>
          <input name="requirements" placeholder="React, Node, CSS" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>

        <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-indigo-700 transition">Post Job</button>
      </form>
    </div>
  );
};

export default AddJob;