import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Update Context with Token, User Data, AND Role
      login(res.data.token, res.data.user, res.data.role);
      
      // Redirect based on Role
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background: linear-gradient(90deg, #F5F5DC, #F2D2D2, #E0E7FF, #F5F5DC);
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite; /* Fast horizontal movement */
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 animate-gradient-x">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
          
          {/* Left Side - Video Placeholder */}
          <div className="w-full md:w-1/2 bg-black relative hidden md:block overflow-hidden">
            {/* REPLACE 'src' WITH YOUR LOCAL VIDEO PATH (e.g., /videos/login.mp4) */}
            <video 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              {/* Example placeholder video - replace with yours */}
              <source src="/images/login.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay Gradient/Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
               <h2 className="text-white text-4xl font-bold tracking-wide mb-2">Welcome Back</h2>
               <p className="text-gray-200 text-lg">Your dream career is just one click away.</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">
             {/* Close/Home Button */}
             <div className="absolute top-6 right-6">
                <Link to="/" className="text-gray-400 hover:text-gray-600 transition p-2">
                  ✕
                </Link>
             </div>

            <div className="max-w-sm mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-500">Please enter your details to continue.</p>
              </div>
              
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center border border-red-100">{error}</div>}
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-500 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
                    Remember me
                  </label>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium">Forgot password?</a>
                </div>

                <button type="submit" className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5">
                  Sign in
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;