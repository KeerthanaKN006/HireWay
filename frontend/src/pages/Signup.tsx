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
          animation: gradient-x 6s ease infinite; 
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 animate-gradient-x">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
          
          {/* Left Side - Dynamic Video Placeholder */}
          <div className="w-full md:w-1/2 bg-black relative hidden md:block overflow-hidden transition-all duration-500">
            {/* REPLACE 'src' WITH YOUR LOCAL VIDEO PATHS */}
            <video 
              key={step} // Forces video to reload when step changes
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              { }
              <source src={step === 1 ? "/images/login.mp4" : "/images/otp.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay Gradient/Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-10">
               <h2 className="text-white text-4xl font-bold tracking-wide mb-2">
                 {step === 1 ? "Start Your Journey" : "Almost There"}
               </h2>
               <p className="text-gray-200 text-lg">
                 {step === 1 ? "Join thousands of professionals finding their dream jobs." : "We just sent a code to your email to verify it's you."}
               </p>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">
             {/* Close Button */}
             <div className="absolute top-6 right-6">
                <Link to="/" className="text-gray-400 hover:text-gray-600 transition p-2">✕</Link>
             </div>

            <div className="max-w-sm mx-auto w-full">
              
              {/* === STEP 1: SIGNUP FORM === */}
              {step === 1 ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-500">Enter your details to get started.</p>
                  </div>
                  
                  {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center border border-red-100">{error}</div>}
                  
                  <form className="space-y-4" onSubmit={handleSignup}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-gray-50 focus:bg-white"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-gray-50 focus:bg-white"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 disabled:bg-gray-400">
                      {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                  </div>
                </>
              ) : (
                
                /* === STEP 2: OTP FORM === */
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verify Email</h2>
                    <p className="text-gray-500">Enter the 6-digit code sent to <span className="font-semibold text-gray-800">{email}</span></p>
                  </div>

                  {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center border border-red-100">{error}</div>}

                  <form className="space-y-6" onSubmit={handleVerify}>
                    <div>
                      <input
                        type="text"
                        placeholder="000000"
                        required
                        maxLength={6}
                        className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-gray-50 focus:bg-white"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 disabled:bg-gray-400">
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-900 underline">
                      Wrong email? Go back
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;