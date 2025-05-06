import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DashboardSelector from './components/DashboardSelector';
import ZerodhaDashboard from './components/ZerodhaDashboard';
import MotilalDashboard from './components/MotilalDashboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/zerodha"
            element={
              <PrivateRoute>
                <ZerodhaDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/motilal"
            element={
              <PrivateRoute>
                <MotilalDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardSelector />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
