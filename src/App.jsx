import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/onboarding" element={
            <PrivateRoute requireOnboarding={false}>
              <Onboarding />
            </PrivateRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute requireOnboarding={true}>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<Appointments />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
