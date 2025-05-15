import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const ProtectedRoute = ({ children }) => {
  if (!auth.currentUser) {
    // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;