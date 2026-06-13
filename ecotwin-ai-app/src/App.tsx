import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const Dashboard       = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CarbonAssessment = lazy(() => import('./pages/CarbonAssessment').then(m => ({ default: m.CarbonAssessment })));
const ClimateTwin     = lazy(() => import('./pages/ClimateTwin').then(m => ({ default: m.ClimateTwin })));
const WhatIfSimulator = lazy(() => import('./pages/WhatIfSimulator').then(m => ({ default: m.WhatIfSimulator })));
const FutureEarth     = lazy(() => import('./pages/FutureEarth').then(m => ({ default: m.FutureEarth })));
const LandingPage     = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Challenges      = lazy(() => import('./pages/Challenges').then(m => ({ default: m.Challenges })));
const Settings        = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

// Auth Pages
const Login           = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const SignUp          = lazy(() => import('./pages/auth/SignUp').then(m => ({ default: m.SignUp })));
const ForgotPassword  = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));

// ─── Minimal page-level loading fallback ─────────────────────────────────────
const PageLoader = () => (
  <div
    className="flex items-center justify-center w-full h-full min-h-screen"
    role="status"
    aria-label="Loading page"
  >
    <span
      className="material-symbols-outlined text-secondary text-4xl animate-spin"
      aria-hidden="true"
    >
      autorenew
    </span>
  </div>
);

function App() {
  const { settings } = useStore();
  const { currentUser, isInitialized, initializeAuth, isDemoMode } = useAuthStore();
  const hydrateStore = useStore(state => state.hydrateStore);
  const resetProgress = useStore(state => state.resetProgress);

  // Initialize auth listener
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Load user data and start sync on login
  useEffect(() => {
    if (!isInitialized) return;

    let unsubscribeSync: (() => void) | null = null;

    if (currentUser) {
      const userId = currentUser.uid;

      const loadAndSyncData = async () => {
        let userData: Record<string, unknown> | null = null;

        if (isDemoMode) {
          const localData = localStorage.getItem(`ecotwin-storage_${userId}`);
          if (localData) {
            try {
              userData = JSON.parse(localData);
            } catch (e) {
              console.error('Failed to parse mock local storage user data:', e);
            }
          }
        } else {
          try {
            const { db } = await import('./firebase');
            if (db) {
              const { doc, getDoc } = await import('firebase/firestore');
              const docRef = doc(db, 'users', userId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                userData = docSnap.data();
              }
            }
          } catch (error) {
            console.error('Failed to fetch user state from Cloud Firestore:', error);
          }
        }

        if (userData) {
          hydrateStore(userData);
        } else {
          // Check for data migration from legacy unauthenticated storage
          const legacyData = localStorage.getItem('ecotwin-storage');
          if (legacyData) {
            try {
              const parsedLegacy = JSON.parse(legacyData);
              // Zustand persisted state structure usually puts data in 'state' field
              const stateData = parsedLegacy.state || parsedLegacy;
              hydrateStore(stateData);

              // Move legacy data to a backup key to prevent duplicate migrations
              localStorage.setItem('ecotwin-storage_migrated', legacyData);
              localStorage.removeItem('ecotwin-storage');
            } catch (err) {
              console.error('Failed to parse and migrate legacy state:', err);
              resetProgress();
            }
          } else {
            resetProgress();
          }
        }

        // Sync settings name/email with Auth display credentials if they are default values
        const currentSettings = useStore.getState().settings;
        if (
          currentSettings.email === 'explorer@ecotwin.ai' ||
          currentSettings.name === 'Eco Explorer'
        ) {
          useStore.getState().updateSettings({
            name: currentUser.displayName || currentSettings.name,
            email: currentUser.email || currentSettings.email,
          });
        }

        // Start debounced active state syncing
        const { startStoreSync } = await import('./store/useStore');
        unsubscribeSync = startStoreSync(userId, isDemoMode);
      };

      loadAndSyncData();
    } else {
      resetProgress();
    }

    return () => {
      if (unsubscribeSync) unsubscribeSync();
    };
  }, [currentUser, isInitialized, isDemoMode, hydrateStore, resetProgress]);

  // Apply Theme class overrides
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-green', 'theme-blue', 'dark');
    if (settings.theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.add('dark');
      if (settings.theme === 'green') {
        root.classList.add('theme-green');
      } else if (settings.theme === 'blue') {
        root.classList.add('theme-blue');
      }
    }
  }, [settings.theme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Auth routes (bypass to Dashboard if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Marketing/Welcome page is always accessible */}
          <Route path="/welcome" element={<LandingPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="climate-twin" element={<ClimateTwin />} />
              <Route path="assessment" element={<CarbonAssessment />} />
              <Route path="simulator" element={<WhatIfSimulator />} />
              <Route path="future-earth" element={<FutureEarth />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

