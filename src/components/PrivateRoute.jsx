import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, requireOnboarding = true }) {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If the route requires onboarding and the user hasn't completed it
  if (requireOnboarding && !userData?.clinicId) {
    return <Navigate to="/onboarding" />;
  }

  // If the route is for onboarding but the user already has a clinic
  if (!requireOnboarding && userData?.clinicId) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
