import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { SideNavBar } from './SideNavBar';
import clsx from 'clsx';

export const Layout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Skip-to-content link — visible on keyboard focus for screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-secondary focus:text-on-secondary focus:rounded-lg focus:font-label-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      <SideNavBar />
      
      {/* Mobile Top Bar */}
      <nav
        className="md:hidden fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300 ease-in-out"
        aria-label="Mobile navigation bar"
      >
        <div className="flex justify-between items-center px-margin-mobile py-4 w-full">
          <div className="font-headline-md text-headline-md font-bold text-primary">EcoTwin AI</div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-on-surface"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span className="material-symbols-outlined" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden fixed top-[68px] left-0 w-full bg-surface-container-low/95 backdrop-blur-xl border-b border-white/10 z-40 p-4 space-y-2 shadow-2xl"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <MobileNavItem to="/" icon="dashboard" label="Dashboard" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/climate-twin" icon="temp_preferences_custom" label="Climate Twin" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/assessment" icon="analytics" label="Assessment" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/simulator" icon="model_training" label="Simulator" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/future-earth" icon="public" label="Future Earth" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/challenges" icon="workspace_premium" label="Challenges" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/settings" icon="settings" label="Settings" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <main id="main-content" className="flex-1 h-full overflow-y-auto md:ml-64 p-margin-mobile md:p-margin-desktop scroll-smooth w-full mt-[68px] md:mt-0">
        <Outlet />
      </main>
    </>
  );
};

const MobileNavItem: React.FC<{ to: string; icon: string; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "px-4 py-3 flex items-center gap-3 font-label-md text-label-md rounded-lg transition-all active:scale-95 duration-200",
          isActive
            ? "bg-secondary/20 text-secondary"
            : "text-on-surface-variant hover:bg-white/5 hover:text-primary"
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
