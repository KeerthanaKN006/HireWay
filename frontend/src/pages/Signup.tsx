import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [step, setStep] = useState(1); // Step 1: Details, Step 2: OTP
  
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resume, setResume] = useState<File | null>(null); // NEW: Resume State
  const [otp, setOtp] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setResume(e.target.files[0]);
  };

  // Step 1: Send Details + Resume -> Request OTP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- USE FORMDATA FOR FILE UPLOAD ---
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (resume) {
      formData.append('resume', resume);
    }

    try {
      // Must set content-type header for files
      await api.post('/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStep(2); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send OTP -> Verify & Login (Same as before)
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
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
          
          {/* Left Side - Dynamic Video */}
          <div className="w-full md:w-1/2 bg-black relative hidden md:block overflow-hidden transition-all duration-500">
            <video 
              key={step} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              autoPlay loop muted playsInline
            >
              <source src={step === 1 ? "/images/login.mp4" : "/images/otp.mp4"} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-10">
               <h2 className="text-white text-4xl font-bold tracking-wide mb-2">
                 {step === 1 ? "Start Your Journey" : "Almost There"}
               </h2>
               <p className="text-gray-200 text-lg">
                 {step === 1 ? "Upload your resume and let us find the best job for you." : "Verify your identity to unlock the dashboard."}
               </p>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white overflow-y-auto">
             <div className="absolute top-6 right-6">
                <Link to="/" className="text-gray-400 hover:text-gray-600 transition p-2">✕</Link>
             </div>

            <div className="max-w-sm mx-auto w-full">
              
              {/* === STEP 1: SIGNUP FORM === */}
              {step === 1 ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-500">Join HireWay today.</p>
                  </div>
                  
                  {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">{error}</div>}
                  
                  <form className="space-y-4" onSubmit={handleSignup}>
                    <input
                      type="text" required placeholder="Full Name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      type="email" required placeholder="Email address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password" required placeholder="Password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* NEW: Resume Upload Field */}
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${resume ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
                      <input type="file" id="signup-resume" className="hidden" accept=".pdf" onChange={handleFileChange} />
                      <label htmlFor="signup-resume" className="cursor-pointer flex flex-col items-center">
                        {resume ? (
                          <div className="flex items-center text-primary font-bold">
                            <CheckCircle className="w-5 h-5 mr-2" /> {resume.name}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                            <span className="font-semibold text-gray-700">Upload Resume (PDF)</span>
                            <span className="block text-xs mt-1">To auto-fill your skills</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg transition disabled:bg-gray-400">
                      {loading ? 'Analyzing Resume...' : 'Sign Up'}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                  </div>
                </>
              ) : (
                /* === STEP 2: OTP FORM (Unchanged) === */
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verify Email</h2>
                    <p className="text-gray-500">Enter code sent to <span className="font-semibold">{email}</span></p>
                  </div>
                  {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 border border-red-100">{error}</div>}
                  <form className="space-y-6" onSubmit={handleVerify}>
                    <input
                      type="text" placeholder="000000" required maxLength={6}
                      className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg transition disabled:bg-gray-400">
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                  </form>
                  <div className="mt-8 text-center">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 underline">Wrong email? Go back</button>
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