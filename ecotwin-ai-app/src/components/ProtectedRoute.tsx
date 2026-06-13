import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  const { currentUser, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-[#0c1513]"
        role="status"
        aria-label="Initializing session"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-5xl animate-spin">
            autorenew
          </span>
          <p className="font-label-md text-label-md text-on-surface-variant animate-pulse">
            Connecting to EcoTwin Engine...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
