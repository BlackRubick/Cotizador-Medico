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
import QuoteReviewPage from './components/pages/QuoteReviewPage';

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
              {/* Redirección inteligente basada en roles */}
              <Route index element={<RoleBasedRedirect />} />
              
              {/* Rutas solo para administradores */}
              <Route 
                path="dashboard" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'administrador']}>
                    <DashboardPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="perfil" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'administrador']}>
                    <ProfilePage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="revisar-cotizaciones" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'administrador']}>
                    <QuoteReviewPage />
                  </RoleBasedRoute>
                } 
              />
              
              {/* Rutas para administradores y vendedores */}
              <Route 
                path="cotizar/*" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'administrador', 'vendedor']}>
                    <QuotePage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="historial" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'administrador', 'vendedor']}>
                    <HistoryPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="clientes" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'administrador', 'vendedor']}>
                    <ClientesPage />
                  </RoleBasedRoute>
                } 
              />
            </Route>

            {/* Catch all route - redirección inteligente basada en roles */}
            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
