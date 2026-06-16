import { create } from 'zustand';
import { getTitleForLevel, getScoreGrade, CHALLENGE_POINTS_MAP } from '../utils/constants';
import { sanitizeAvatar, clampValue } from '../utils/sanitize';
import { useAuthStore } from './useAuthStore';

// Re-export for backward compatibility with existing imports in pages
export { getScoreGrade };

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  icon: string;
  label: string;
  saved: number;       // kg CO₂
  waterSaved: number;  // litres water
  date: string;
  color: string;
}

export interface AssessmentAnswers {
  commute: string;
  distance: string;
  energy: string;
  homeSize: string;
  diet: string;
  shopping: string;
  recycling: string;
  completed: boolean;
}

export interface EmissionBreakdown {
  transport: number;
  home: number;
  diet: number;
  lifestyle: number;
}

export interface UserSettings {
  name: string;
  email: string;
  role: string;
  avatar: string;
  theme: 'dark' | 'light' | 'green' | 'blue';
  animations: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  challengeReminders: boolean;
  aiRecommendations: boolean;
  emailNotifications: boolean;
  region: 'India' | 'US' | 'Europe' | 'Global';
  projectionYear: 2030 | 2040 | 2050;
  complexity: 'Basic' | 'Advanced' | 'Expert';
  defaultScenario: 'Business As Usual' | 'Moderate Action' | 'Net Zero 2050';
  twoFactor: boolean;
  connectedServices: {
    weatherApi: boolean;
    carbonApi: boolean;
    emissionsDataset: boolean;
    iotSensors: boolean;
  };
}

interface UserState {
  ecoScore: number;
  carbonFootprint: number;
  ecoLevel: number;
  ecoTitle: string;
  ecoXP: number;
  isDarkMode: boolean;
  completedChallenges: number[];
  activityLog: ActivityEntry[];
  assessmentAnswers: AssessmentAnswers;
  emissionBreakdown: EmissionBreakdown;
  monthlyProgress: number;
  settings: UserSettings;

  // Actions
  setEcoScore: (score: number) => void;
  setCarbonFootprint: (footprint: number) => void;
  setEmissionBreakdown: (breakdown: EmissionBreakdown) => void;
  setAssessmentAnswers: (answers: AssessmentAnswers) => void;
  setMonthlyProgress: (progress: number) => void;
  updateLevel: () => void;
  toggleDarkMode: () => void;
  toggleChallenge: (id: number) => void;
  logActivity: (entry: Omit<ActivityEntry, 'id' | 'date'>) => void;

  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  clearCache: () => void;
  resetProgress: () => void;
  hydrateStore: (persistedState: Partial<UserState>) => void;
}

// ─── Default Settings ─────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: UserSettings = {
  name: 'Eco Explorer',
  email: 'explorer@ecotwin.ai',
  role: 'Researcher',
  avatar: '/avatars/avatar-1.svg',
  theme: 'dark',
  animations: true,
  reducedMotion: false,
  compactMode: false,
  weeklyReport: true,
  achievementAlerts: true,
  challengeReminders: true,
  aiRecommendations: true,
  emailNotifications: false,
  region: 'Global',
  projectionYear: 2040,
  complexity: 'Advanced',
  defaultScenario: 'Moderate Action',
  twoFactor: false,
  connectedServices: {
    weatherApi: true,
    carbonApi: true,
    emissionsDataset: true,
    iotSensors: false,
  },
};

const DEFAULT_ASSESSMENT_ANSWERS: AssessmentAnswers = {
  commute: '',
  distance: '',
  energy: '',
  homeSize: '',
  diet: '',
  shopping: '',
  recycling: '',
  completed: false,
};

const DEFAULT_EMISSION_BREAKDOWN: EmissionBreakdown = {
  transport: 45,
  home: 30,
  diet: 15,
  lifestyle: 10,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<UserState>()((set, get) => ({
  ecoScore: 84,
  carbonFootprint: 14.2,
  ecoLevel: 12,
  ecoTitle: 'Forest Guardian',
  ecoXP: 2356,
  isDarkMode: true,
  completedChallenges: [],
  activityLog: [
    { id: '1', icon: 'directions_bike', label: 'Cycled to work',    saved: 2.4, waterSaved: 0,   date: 'Today',     color: 'tertiary'  },
    { id: '2', icon: 'thermostat',       label: 'Lowered thermostat',saved: 1.1, waterSaved: 20,  date: 'Yesterday', color: 'secondary' },
    { id: '3', icon: 'restaurant',       label: 'Plant-based meal',  saved: 1.8, waterSaved: 500, date: 'Mon',       color: 'primary'   },
  ],
  assessmentAnswers: DEFAULT_ASSESSMENT_ANSWERS,
  emissionBreakdown: DEFAULT_EMISSION_BREAKDOWN,
  monthlyProgress: 12,
  settings: DEFAULT_SETTINGS,

  // ─ Simple setters ─────────────────────────────────────────────────────
  setEcoScore:         (score)     => set({ ecoScore: clampValue(score, 0, 100, 50) }),
  setCarbonFootprint:  (footprint) => set({ carbonFootprint: clampValue(footprint, 0, 100, 14.2) }),
  setEmissionBreakdown:(breakdown) => set({ emissionBreakdown: breakdown }),
  setAssessmentAnswers:(answers)   => set({ assessmentAnswers: answers }),
  setMonthlyProgress:  (progress)  => set({ monthlyProgress: clampValue(progress, -100, 100, 0) }),

  // ─ Level recalculation ────────────────────────────────────────────────
  updateLevel: () => {
    const { ecoXP } = get();
    const newLevel = Math.max(1, Math.floor(ecoXP / 200) + 1);
    set({ ecoLevel: newLevel, ecoTitle: getTitleForLevel(newLevel) });
  },

  // ─ Theme toggle ───────────────────────────────────────────────────────
  toggleDarkMode: () => {
    set((state) => {
      const nextTheme = state.settings.theme === 'light' ? 'dark' : 'light';
      return {
        isDarkMode: !state.isDarkMode,
        settings: { ...state.settings, theme: nextTheme },
      };
    });
  },

  // ─ Challenge toggle ───────────────────────────────────────────────────
  toggleChallenge: (id) => {
    set((state) => {
      const wasCompleted = state.completedChallenges.includes(id);
      const completed = wasCompleted
        ? state.completedChallenges.filter((c) => c !== id)
        : [...state.completedChallenges, id];

      const points = CHALLENGE_POINTS_MAP[id] ?? 50;
      const delta = wasCompleted ? -points : points;
      const newXP = Math.max(0, state.ecoXP + delta);
      const scoreDelta = wasCompleted ? -1 : 1;
      const newScore = Math.min(100, Math.max(10, state.ecoScore + scoreDelta));

      return { completedChallenges: completed, ecoScore: newScore, ecoXP: newXP };
    });
    get().updateLevel();
  },

  // ─ Activity logging ───────────────────────────────────────────────────
  logActivity: (entry) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: Date.now().toString(),
      date: 'Just now',
    };
    set((state) => {
      const xpGained = Math.round((entry.saved * 10) + (entry.waterSaved / 10));
      const newXP = state.ecoXP + xpGained;
      const newScore = Math.min(100, state.ecoScore + 2);
      const newFootprint = Math.max(1.0, state.carbonFootprint - (entry.saved / 1000));
      return {
        activityLog: [newEntry, ...state.activityLog].slice(0, 20),
        ecoXP: newXP,
        ecoScore: newScore,
        carbonFootprint: Number(newFootprint.toFixed(2)),
      };
    });
    get().updateLevel();
  },

  // ─ Settings actions ───────────────────────────────────────────────────
  updateSettings: (newSettings) =>
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      return {
        settings: updated,
        isDarkMode: updated.theme !== 'light',
      };
    }),

  resetSettings: () => set({ settings: DEFAULT_SETTINGS, isDarkMode: true }),

  clearCache: () => {
    get().resetProgress();
    const authState = useAuthStore.getState();
    if (authState.currentUser) {
      const userId = authState.currentUser.uid;
      if (authState.isDemoMode) {
        localStorage.removeItem(`ecotwin-storage_${userId}`);
      } else {
        // Trigger Firestore delete async
        import('../firebase').then(({ db }) => {
          if (db) {
            import('firebase/firestore').then(({ doc, deleteDoc }) => {
              const docRef = doc(db, 'users', userId);
              deleteDoc(docRef).catch((err) => console.error('Failed to clear user doc:', err));
            });
          }
        });
      }
    }
  },

  resetProgress: () => {
    set({
      ecoXP: 0,
      ecoLevel: 1,
      ecoTitle: getTitleForLevel(1),
      ecoScore: 50,
      carbonFootprint: 14.2,
      completedChallenges: [],
      activityLog: [],
      assessmentAnswers: DEFAULT_ASSESSMENT_ANSWERS,
      emissionBreakdown: DEFAULT_EMISSION_BREAKDOWN,
    });
  },

  hydrateStore: (persistedState) => {
    if (!persistedState) return;
    set((currentState) => {
      const merged = { ...currentState, ...persistedState };

      // Deep-merge connectedServices so individual booleans aren't lost
      if (persistedState.settings && currentState.settings) {
        merged.settings = {
          ...DEFAULT_SETTINGS,
          ...currentState.settings,
          ...persistedState.settings,
          connectedServices: {
            ...DEFAULT_SETTINGS.connectedServices,
            ...(persistedState.settings.connectedServices ?? {}),
          },
        };
      }

      // Sanitize the avatar URL using the shared helper (single source of truth)
      if (merged.settings?.avatar) {
        merged.settings = {
          ...merged.settings,
          avatar: sanitizeAvatar(merged.settings.avatar),
        };
      }

      // Recalculate level from XP to ensure synchronisation on hydration
      const calculatedLevel = Math.max(1, Math.floor(merged.ecoXP / 200) + 1);
      merged.ecoLevel = calculatedLevel;
      merged.ecoTitle = getTitleForLevel(calculatedLevel);

      return merged;
    });
  },
}));

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export const startStoreSync = (userId: string, isDemoMode: boolean) => {
  if (syncTimeout) clearTimeout(syncTimeout);

  return useStore.subscribe((state) => {
    if (syncTimeout) clearTimeout(syncTimeout);

    syncTimeout = setTimeout(async () => {
      const dataToSave = {
        ecoScore: state.ecoScore,
        carbonFootprint: state.carbonFootprint,
        ecoLevel: state.ecoLevel,
        ecoTitle: state.ecoTitle,
        ecoXP: state.ecoXP,
        completedChallenges: state.completedChallenges,
        activityLog: state.activityLog,
        assessmentAnswers: state.assessmentAnswers,
        emissionBreakdown: state.emissionBreakdown,
        monthlyProgress: state.monthlyProgress,
        settings: state.settings,
      };

      if (isDemoMode) {
        localStorage.setItem(`ecotwin-storage_${userId}`, JSON.stringify(dataToSave));
      } else {
        try {
          const { db } = await import('../firebase');
          if (db) {
            const { doc, setDoc } = await import('firebase/firestore');
            const docRef = doc(db, 'users', userId);
            await setDoc(docRef, dataToSave, { merge: true });
          }
        } catch (error) {
          console.error('Failed to sync state to Firestore:', error);
        }
      }
    }, 1000);
  });
};


