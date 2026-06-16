import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

// Firebase configuration errors that should trigger Demo Mode fallback
const FIREBASE_CONFIG_ERRORS = [
  'auth/configuration-not-found',
  'auth/internal-error',
  'auth/project-not-found',
  'auth/api-key-not-valid',
];

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
}

interface AuthState {
  currentUser: AuthUser | null;
  isInitialized: boolean;
  isDemoMode: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => void;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

// Simple synchronous password hashing for mock fallback
const mockHashPassword = (password: string, email: string): string => {
  return btoa(`ecotwin-salt-${password}-${email.toLowerCase().trim()}`);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isInitialized: false,
  isDemoMode: import.meta.env.DEV ? !isFirebaseConfigured : false,
  error: null,

  initializeAuth: () => {
    if (!get().isDemoMode && auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          set({
            currentUser: {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Eco Explorer',
            },
            isInitialized: true,
          });
        } else {
          set({ currentUser: null, isInitialized: true });
        }
      });
    } else if (get().isDemoMode) {
      // Demo Mode initialization from local storage
      const cached = localStorage.getItem('ecotwin_mock_current_user');
      set({
        currentUser: cached ? JSON.parse(cached) : null,
        isInitialized: true,
      });
    } else {
      // Production mode but Firebase auth not available/initialized
      set({
        currentUser: null,
        isInitialized: true,
      });
    }
  },

  signUp: async (name, email, password) => {
    set({ error: null });
    const formattedEmail = email.toLowerCase().trim();

    if (get().isDemoMode) {
      // ─── Demo Mode Sign Up ──────────────────────────────────────────────────
      const mockUsersRaw = localStorage.getItem('ecotwin_mock_users') || '[]';
      const mockUsers: MockUser[] = JSON.parse(mockUsersRaw);

      if (mockUsers.some((u) => u.email === formattedEmail)) {
        const errMsg = 'Email address already in use.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }

      const newUid = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newUser: MockUser = {
        uid: newUid,
        email: formattedEmail,
        displayName: name.trim(),
        passwordHash: mockHashPassword(password, formattedEmail),
      };

      mockUsers.push(newUser);
      localStorage.setItem('ecotwin_mock_users', JSON.stringify(mockUsers));

      const authUser: AuthUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
      };

      localStorage.setItem('ecotwin_mock_current_user', JSON.stringify(authUser));
      set({ currentUser: authUser });
      return { success: true };
    } else {
      // ─── Firebase Sign Up ───────────────────────────────────────────────────
      if (!auth) {
        const errMsg = 'Authentication service is currently unavailable. Please verify Firebase configuration.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }
      try {
        const credential = await createUserWithEmailAndPassword(auth, formattedEmail, password);
        await updateProfile(credential.user, { displayName: name.trim() });
        
        // Triggers the state updates automatically via onAuthStateChanged,
        // but returning success confirms page redirection.
        return { success: true };
      } catch (err) {
        const firebaseErr = err as { code?: string };
        // If Firebase Auth isn't configured, fall back to Demo Mode ONLY in development
        if (import.meta.env.DEV && firebaseErr.code && FIREBASE_CONFIG_ERRORS.includes(firebaseErr.code)) {
          console.warn('Firebase Auth not configured, switching to Demo Mode.');
          set({ isDemoMode: true });
          return get().signUp(name, email, password);
        }
        const errMsg = err instanceof Error ? err.message : 'Registration failed.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }
    }
  },

  login: async (email, password) => {
    set({ error: null });
    const formattedEmail = email.toLowerCase().trim();

    if (get().isDemoMode) {
      // ─── Demo Mode Login ────────────────────────────────────────────────────
      const mockUsersRaw = localStorage.getItem('ecotwin_mock_users') || '[]';
      const mockUsers: MockUser[] = JSON.parse(mockUsersRaw);

      const targetUser = mockUsers.find((u) => u.email === formattedEmail);
      const computedHash = mockHashPassword(password, formattedEmail);

      if (!targetUser || targetUser.passwordHash !== computedHash) {
        const errMsg = 'Invalid email or password.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }

      const authUser: AuthUser = {
        uid: targetUser.uid,
        email: targetUser.email,
        displayName: targetUser.displayName,
      };

      localStorage.setItem('ecotwin_mock_current_user', JSON.stringify(authUser));
      set({ currentUser: authUser });
      return { success: true };
    } else {
      // ─── Firebase Login ─────────────────────────────────────────────────────
      if (!auth) {
        const errMsg = 'Authentication service is currently unavailable. Please verify Firebase configuration.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }
      try {
        await signInWithEmailAndPassword(auth, formattedEmail, password);
        return { success: true };
      } catch (err) {
        const firebaseErr = err as { code?: string; message?: string };
        // If Firebase Auth isn't configured, fall back to Demo Mode ONLY in development
        if (import.meta.env.DEV && firebaseErr.code && FIREBASE_CONFIG_ERRORS.includes(firebaseErr.code)) {
          console.warn('Firebase Auth not configured, switching to Demo Mode.');
          set({ isDemoMode: true });
          return get().login(email, password);
        }
        let errMsg = 'Failed to log in. Please check your credentials.';
        if (firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/wrong-password') {
          errMsg = 'Invalid email or password.';
        }
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }
    }
  },

  logout: async () => {
    if (get().isDemoMode) {
      // ─── Demo Mode Logout ───────────────────────────────────────────────────
      localStorage.removeItem('ecotwin_mock_current_user');
      set({ currentUser: null });
    } else {
      // ─── Firebase Logout ────────────────────────────────────────────────────
      if (!auth) {
        set({ currentUser: null });
        return;
      }
      try {
        await signOut(auth);
        set({ currentUser: null });
      } catch (err) {
        console.error('Failed to log out:', err);
      }
    }
  },

  resetPassword: async (email) => {
    set({ error: null });
    const formattedEmail = email.toLowerCase().trim();

    if (get().isDemoMode) {
      // ─── Demo Mode Reset Password (Mock response) ───────────────────────────
      const mockUsersRaw = localStorage.getItem('ecotwin_mock_users') || '[]';
      const mockUsers: MockUser[] = JSON.parse(mockUsersRaw);

      if (!mockUsers.some((u) => u.email === formattedEmail)) {
        const errMsg = 'No user registered with this email.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }

      return { success: true };
    } else {
      // ─── Firebase Reset Password ───────────────────────────────────────────
      if (!auth) {
        const errMsg = 'Authentication service is currently unavailable. Please verify Firebase configuration.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }
      try {
        await sendPasswordResetEmail(auth, formattedEmail);
        return { success: true };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to send password reset email.';
        set({ error: errMsg });
        return { success: false, error: errMsg };
      }
    }
  },

  clearError: () => set({ error: null }),
}));
