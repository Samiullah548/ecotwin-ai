import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';

export const SideNavBar: React.FC = () => {
  const { ecoLevel, ecoTitle, settings } = useStore();
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav
      className="hidden md:flex flex-col bg-surface-container-low/80 backdrop-blur-2xl border-r border-white/10 shadow-2xl shadow-black/40 fixed left-0 top-0 h-full w-64 z-40 py-8"
      aria-label="Main navigation"
    >
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center glow-tertiary">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">EcoTwin AI</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Sustainability Engine</p>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 space-y-2">
        <NavItem to="/" icon="dashboard" label="Dashboard" />
        <NavItem to="/climate-twin" icon="temp_preferences_custom" label="Climate Twin" />
        <NavItem to="/assessment" icon="analytics" label="Assessment" />
        <NavItem to="/simulator" icon="model_training" label="Simulator" />
        <NavItem to="/future-earth" icon="public" label="Future Earth" />
        <NavItem to="/challenges" icon="workspace_premium" label="Challenges" />
      </div>
      <div className="px-4 mt-auto space-y-2">
        <NavItem to="/settings" icon="settings" label="Settings" />
        <div className="mt-6 pt-6 border-t border-white/10 px-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            aria-label={`Go to settings for ${currentUser?.displayName || settings.name}`}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors w-full text-left"
          >
            <img
              alt=""
              className="w-10 h-10 rounded-full border border-primary/30 object-cover"
              src={settings.avatar}
              onError={(e) => {
                e.currentTarget.src = '/avatars/avatar-1.svg';
              }}
            />
            <div className="overflow-hidden flex-1">
              <p className="font-label-md text-label-md text-on-surface truncate">
                {currentUser?.displayName || settings.name}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Level {ecoLevel} · {ecoTitle}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 cursor-pointer hover:bg-rose-500/10 hover:text-rose-400 text-on-surface-variant p-2 rounded-lg transition-colors w-full text-left font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "px-4 py-3 flex items-center gap-3 font-label-md text-label-md rounded-r-lg transition-all active:scale-95 duration-200",
          isActive
            ? "bg-secondary/20 text-secondary border-l-4 border-secondary"
            : "text-on-surface-variant hover:bg-white/5 hover:text-primary border-l-4 border-transparent"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
};
