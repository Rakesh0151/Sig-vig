import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

import Dashboard from './pages/Dashboard';
import PrrChiAnalysis from './pages/PrrChiAnalysis';
import EbgmAnalysis from './pages/EbgmAnalysis';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute, AdminRoute } from './context/ProtectedRoute';

// Create a PublicRoute component for authentication pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is authenticated and tries to access auth pages, redirect to home
  if (isAuthenticated && ['/login', '/forgot-password'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Always allow access to reset-password page
  if (location.pathname.startsWith('/reset-password')) {
    return children;
  }

  return children;
};

// Create a wrapper component to handle navbar rendering
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prr-chi" 
          element={
            <ProtectedRoute>
              <PrrChiAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ebgm" 
          element={
            <ProtectedRoute>
              <EbgmAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;