import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, PlusCircle, Search, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={role === 'admin' ? '/admin' : '/'} className="flex items-center text-primary font-bold text-xl">
              <Briefcase className="mr-2 h-6 w-6" />
              JobHunt<span className="text-gray-900">Lite</span>
              {role === 'admin' && <span className="ml-2 text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full">ADMIN</span>}
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            
            {/* --- ADMIN LINKS --- */}
            {isAuthenticated && role === 'admin' ? (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Manage Jobs
                </Link>
                <Link to="/admin/add-job" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition flex items-center">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Post a Job
                </Link>
              </>
            ) : (
              /* --- USER / GUEST LINKS --- */
              <Link to="/" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Search className="w-4 h-4 mr-1" />
                Find Jobs
              </Link>
            )}

            {/* --- USER DASHBOARD & PROFILE (Only for non-admins) --- */}
            {isAuthenticated && role === 'user' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  My Dashboard
                </Link>
                {/* NEW PROFILE LINK */}
                <Link to="/profile" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <User className="w-4 h-4 mr-1" /> Profile
                </Link>
              </>
            )}

            {/* --- AUTH BUTTONS --- */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-500 hidden sm:block">
                  {role === 'admin' ? 'Admin' : `Hi, ${user?.name}`}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 ml-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;