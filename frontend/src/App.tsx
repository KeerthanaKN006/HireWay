import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import ApplyJob from './pages/ApplyJob'; // <--- NEW IMPORT
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import AddJob from './pages/admin/AddJob';
import AdminRoute from './components/AdminRoute';
import JobApplicants from './pages/admin/JobApplicants';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User Dashboard & Actions */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* --- NEW ROUTE: Apply with Resume --- */}
            <Route 
              path="/jobs/:id/apply" 
              element={
                <ProtectedRoute>
                  <ApplyJob />
                </ProtectedRoute>
              } 
            />

            {/* --- ADMIN ROUTES --- */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/job/:id/applicants" 
              element={
                <AdminRoute>
                  <JobApplicants />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/add-job" 
              element={
                <AdminRoute>
                  <AddJob />
                </AdminRoute>
              } 
            />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;