// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import Layout from './components/Layout/Layout';

// Auth Pages
import LoginPage from './components/pages/LoginPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';

// App Pages
import DashboardPage from './components/pages/DashboardPage';
import ProfilePage from './components/pages/ProfilePage';
import HistoryPage from './components/pages/HistoryPage';
import QuotePage from './components/pages/QuotePage';
import ClientesPage from './components/pages/ClientesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Rutas simplificadas - SIN protección por roles por ahora */}
              <Route index element={<RoleBasedRedirect />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="cotizar/*" element={<QuotePage />} />
              <Route path="cotizar" element={<QuotePage />} />
              <Route path="historial" element={<HistoryPage />} />
              <Route path="clientes" element={<ClientesPage />} />
            </Route>

            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
