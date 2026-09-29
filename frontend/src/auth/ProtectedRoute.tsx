import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './MockAuthProvider';
import { UserRole } from '../types/auth';
import { ROLE_DEFAULT_DASHBOARD } from './roleConfig';

/**
 * CLIENT-SIDE UI ROUTE GUARD ONLY
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * Frontend role isolation and client-side guards do not provide cryptographic security.
 * When the production backend is connected, server-side authorization (RBAC) and session
 * token verification will enforce access control on API requests.
 */
interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated visitors to login, preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cross-role guard: redirect unauthorized roles to their own dedicated application
  if (!allowedRoles.includes(user.role)) {
    const fallbackPath = ROLE_DEFAULT_DASHBOARD[user.role] || '/login';
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export const ParticipantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['participant']}>{children}</ProtectedRoute>
);

export const OrganizerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['organizer']}>{children}</ProtectedRoute>
);

export const JudgeRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['judge']}>{children}</ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);
