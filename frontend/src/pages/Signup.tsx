import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Signup = () => {
  const [step, setStep] = useState(1); // Step 1: Details, Step 2: OTP
  
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send Details -> Request OTP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', { name, email, password });
      setStep(2); // Move to OTP screen
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send OTP -> Verify & Login
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      
      // --- CHANGE IS HERE ---
      // We must pass the 'role' (which is 'user') to the login function
      login(res.data.token, res.data.user, res.data.role); 
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow space-y-8">
        
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-900">Create Account</h2>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded text-center">{error}</div>}
            
            <form className="mt-8 space-y-6" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {loading ? 'Sending OTP...' : 'Sign Up'}
              </button>
            </form>
            <div className="text-center">
              <Link to="/login" className="text-primary hover:text-indigo-700">Already have an account? Login</Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-900">Verify Email</h2>
            <p className="text-center text-gray-500">We sent a code to {email}</p>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded text-center">{error}</div>}
            
            <form className="mt-8 space-y-6" onSubmit={handleVerify}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-center text-xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
            <div className="text-center">
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-900">
                Wrong email? Go back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;