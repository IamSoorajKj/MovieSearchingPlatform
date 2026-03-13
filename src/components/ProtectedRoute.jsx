import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to home if user is not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
