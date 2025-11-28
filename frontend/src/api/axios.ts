import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Matches your backend
});

// Interceptor: Automatically add Token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;