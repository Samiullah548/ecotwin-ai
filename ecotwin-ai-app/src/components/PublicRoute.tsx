import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PublicRoute: React.FC = () => {
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
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
