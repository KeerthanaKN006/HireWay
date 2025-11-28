import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // Must be logged in AND have role 'admin'
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;