import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  if (adminOnly && role !== 'admin') {
    // Redirect to dashboard if trying to access admin page without admin role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
