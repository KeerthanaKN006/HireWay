import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { Search, Filter, ArrowRight, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Local Images for Slider
// Using only the 6 distinct images as requested
const sliderImages = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
  "/images/slide3.jpg",
  "/images/slide4.jpg",
  "/images/slide5.jpg",
  "/images/slide6.jpg",
];

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = jobType === 'All' || job.type === jobType;
    return matchesSearch && matchesType;
  });

  const scrollToSearch = () => {
    document.getElementById('job-search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          /* Gradient moving between Beige, a warm Light Maroon tint, and Cream */
          background: linear-gradient(-45deg, #F5F5DC, #FFF8DC, #F2D2D2, #F5F5DC);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
        }
      `}</style>

      <div className="min-h-screen animate-gradient-bg overflow-x-hidden">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-16 pb-20">
          
          {/* Text Content */}
          <div className="max-w-7xl mx-auto text-center relative z-10 px-4 mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight"
            >
              Streamline Your Team, <br />
              <span className="text-primary">Supercharge Your Workflow</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            >
              All-in-one platform to find, apply, and track your dream jobs. 
              Connect with top companies faster and smarter.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* ================= 3D CURVED CAROUSEL ================= */}
          <div className="w-full relative z-20">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'} // Allows slides to find their own width
              initialSlide={2} // Start in the middle
              loop={true} // Swiper handles looping the 6 images automatically
              speed={800} 
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              coverflowEffect={{
                rotate: 0,       
                stretch: 0,      
                depth: 150,      
                modifier: 2.5,   
                slideShadows: false, 
                scale: 0.9,      
              }}
              modules={[EffectCoverflow, Autoplay]}
              className="w-full py-10"
            >
              {sliderImages.map((imgUrl, index) => (
                <SwiperSlide key={index} className="!w-[280px] md:!w-[350px] !h-[400px] md:!h-[500px] transition-all duration-500">
                  {({ isActive }) => (
                    <div 
                      className={`w-full h-full relative group rounded-3xl overflow-hidden transition-all duration-500 ${isActive ? 'opacity-100 scale-100 shadow-2xl' : 'opacity-40 scale-95'}`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Slide ${index}`} 
                        className="w-full h-full object-cover transform transition duration-700" 
                      />
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>


        {/* ================= FEATURES SECTION ================= */}
        <section className="py-24 bg-white/80 backdrop-blur-sm rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.05)] relative z-30 -mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Everything Your Team Needs to Work Smarter</h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">From task tracking to real-time chat, our features are built to keep your team connected, organized, and moving forward.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#F9F9F0] p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="w-full h-48 bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                   <img src="/images/teamchat.jpg" className="w-full h-full object-cover" alt="Chat" onError={(e) => e.currentTarget.src='https://cdni.iconscout.com/illustration/premium/thumb/business-chat-4055272-3351963.png?f=webp'} />
                </div>
                <h3 className="text-xl font-bold mb-2">Built-In Team Chat</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Communicate instantly within projects—no need to switch apps.</p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-[#F9F9F0] p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="w-full h-48 bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                   <img src="/images/tasks.jpg" className="w-full h-full object-cover" alt="Tasks" onError={(e) => e.currentTarget.src='https://cdni.iconscout.com/illustration/premium/thumb/task-completion-4055273-3351964.png?f=webp'} />
                </div>
                <h3 className="text-xl font-bold mb-2">Task Assignment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Easily create, assign, and track tasks to keep everyone aligned.</p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#F9F9F0] p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="w-full h-48 bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                   <img src="/images/progress.jpg" className="w-full h-full object-cover" alt="Stats" onError={(e) => e.currentTarget.src='https://cdni.iconscout.com/illustration/premium/thumb/business-growth-4055274-3351965.png?f=webp'} />
                </div>
                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Visualize team performance with dashboards that highlight what's done.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= JOB SEARCH SECTION ================= */}
        <div id="job-search-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-sm rounded-b-3xl">
          
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900">Explore Open Roles</h2>
             <p className="text-gray-500 mt-2">Browse thousands of jobs from top companies.</p>
          </div>

          {/* Search Header */}
          <div className="mb-8 space-y-4 bg-white/60 p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or company..."
                  className="pl-11 block w-full border-transparent rounded-2xl border py-4 focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-medium shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative md:min-w-[200px]">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  className="pl-11 block w-full border-transparent rounded-2xl border py-4 focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-medium appearance-none shadow-sm"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Grid */}
          {loading ? (
            <div className="text-center py-10">Loading jobs...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <p className="text-gray-500 col-span-full text-center">No jobs found matching your criteria.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Simple */}
        <footer className="bg-gray-900 text-white py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Hire<span className="text-primary">Way</span></h2>
          <p className="text-gray-400">© 2025 HireWay. All rights reserved.</p>
        </footer>

      </div>
    </>
  );
};

export default Home;