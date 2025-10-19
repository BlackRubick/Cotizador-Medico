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
import UserCreatePage from './components/pages/UserCreatePage/UserCreatePage.jsx';

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
              {/* Protección real por roles */}
              <Route index element={<RoleBasedRedirect />} />
              {/* Dashboard solo para jefes */}
              <Route path="dashboard" element={
                <RoleBasedRoute allowedRoles={["jefe"]}>
                  <DashboardPage />
                </RoleBasedRoute>
              } />
              {/* Cotizar: jefes y vendedores */}
              <Route path="cotizar/*" element={
                <RoleBasedRoute allowedRoles={["jefe", "vendedor"]}>
                  <QuotePage />
                </RoleBasedRoute>
              } />
              <Route path="cotizar" element={
                <RoleBasedRoute allowedRoles={["jefe", "vendedor"]}>
                  <QuotePage />
                </RoleBasedRoute>
              } />
              {/* Historial: jefes y vendedores */}
              <Route path="historial" element={
                <RoleBasedRoute allowedRoles={["jefe", "vendedor"]}>
                  <HistoryPage />
                </RoleBasedRoute>
              } />
              {/* Clientes solo para jefes */}
              <Route path="clientes" element={
                <RoleBasedRoute allowedRoles={["jefe"]}>
                  <ClientesPage />
                </RoleBasedRoute>
              } />

              {/* Crear usuario solo para jefes */}
              <Route path="crear-usuario" element={
                <RoleBasedRoute allowedRoles={["jefe"]}>
                  <UserCreatePage />
                </RoleBasedRoute>
              } />
            </Route>

            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
