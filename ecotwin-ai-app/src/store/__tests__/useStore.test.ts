import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore, startStoreSync } from '../useStore';
import { useAuthStore } from '../useAuthStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.getState().resetProgress();
    useStore.getState().resetSettings();
  });

  it('should initialize with correct default states', () => {
    const state = useStore.getState();
    expect(state.ecoLevel).toBe(1);
    expect(state.ecoXP).toBe(0);
    expect(state.ecoScore).toBe(50);
    expect(state.carbonFootprint).toBe(14.2);
    expect(state.completedChallenges).toHaveLength(0);
    expect(state.activityLog).toHaveLength(0);
  });

  it('should clamp ecoScore on setting', () => {
    const store = useStore.getState();
    store.setEcoScore(120);
    expect(useStore.getState().ecoScore).toBe(100);

    store.setEcoScore(-10);
    expect(useStore.getState().ecoScore).toBe(0);

    store.setEcoScore(75);
    expect(useStore.getState().ecoScore).toBe(75);
  });

  it('should clamp carbonFootprint on setting', () => {
    const store = useStore.getState();
    store.setCarbonFootprint(120);
    expect(useStore.getState().carbonFootprint).toBe(100);

    store.setCarbonFootprint(-5);
    expect(useStore.getState().carbonFootprint).toBe(0);
  });

  it('should clamp monthlyProgress on setting', () => {
    const store = useStore.getState();
    store.setMonthlyProgress(150);
    expect(useStore.getState().monthlyProgress).toBe(100);

    store.setMonthlyProgress(-120);
    expect(useStore.getState().monthlyProgress).toBe(-100);
  });

  it('should recalculate level and eco title based on XP', () => {
    const store = useStore.getState();
    
    // Set XP to level 3 (400 XP)
    useStore.setState({ ecoXP: 450 });
    store.updateLevel();
    
    const state = useStore.getState();
    expect(state.ecoLevel).toBe(3);
    expect(state.ecoTitle).toBe('Seed Planter');
  });

  it('should toggle dark mode theme setting', () => {
    const store = useStore.getState();
    expect(store.isDarkMode).toBe(true);
    expect(store.settings.theme).toBe('dark');

    store.toggleDarkMode();
    
    const state1 = useStore.getState();
    expect(state1.isDarkMode).toBe(false);
    expect(state1.settings.theme).toBe('light');

    store.toggleDarkMode();
    
    const state2 = useStore.getState();
    expect(state2.isDarkMode).toBe(true);
    expect(state2.settings.theme).toBe('dark');
  });

  it('should update partial settings', () => {
    const store = useStore.getState();
    store.updateSettings({ name: 'John Doe', avatar: '/avatars/avatar-2.svg' });

    const state = useStore.getState();
    expect(state.settings.name).toBe('John Doe');
    expect(state.settings.avatar).toBe('/avatars/avatar-2.svg');
  });

  it('should handle toggleChallenge completions and XP/Score adjustments', () => {
    const store = useStore.getState();
    
    // Toggle challenge #1 (Meatless Monday: 50 points)
    store.toggleChallenge(1);
    
    const state1 = useStore.getState();
    expect(state1.completedChallenges).toContain(1);
    expect(state1.ecoXP).toBe(50); // 50 points gained
    expect(state1.ecoScore).toBe(51); // score increases by 1

    // Toggle challenge #1 again (removes it)
    store.toggleChallenge(1);
    
    const state2 = useStore.getState();
    expect(state2.completedChallenges).not.toContain(1);
    expect(state2.ecoXP).toBe(0); // 50 points lost
    expect(state2.ecoScore).toBe(50); // score decreases by 1
  });

  it('should log activities and adjust carbon metrics', () => {
    const store = useStore.getState();
    
    store.logActivity({
      label: 'Used reusable cup',
      icon: 'local_cafe',
      saved: 10.0, // kg CO2 saved
      waterSaved: 200, // L water saved
      color: 'primary',
    });

    const state = useStore.getState();
    expect(state.activityLog).toHaveLength(1);
    expect(state.activityLog[0].label).toBe('Used reusable cup');
    expect(state.ecoXP).toBe(120); // (10 * 10) + (200 / 10) = 120 XP
    expect(state.ecoScore).toBe(52); // ecoScore + 2
    expect(state.carbonFootprint).toBe(14.19); // 14.2 - (10 / 1000) = 14.19
  });

  it('should hydrate store with persisted state correctly', () => {
    const store = useStore.getState();
    
    store.hydrateStore({
      ecoXP: 500,
      ecoScore: 90,
      carbonFootprint: 5.5,
      completedChallenges: [2],
      settings: {
        name: 'Alice',
        avatar: '/avatars/avatar-3.svg',
      },
    });

    const state = useStore.getState();
    expect(state.ecoXP).toBe(500);
    expect(state.ecoLevel).toBe(3); // 500 / 200 + 1 = 3
    expect(state.ecoTitle).toBe('Seed Planter');
    expect(state.settings.name).toBe('Alice');
    expect(state.settings.avatar).toBe('/avatars/avatar-3.svg');
  });

  describe('Cache and State Synchronization', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should clear cache when no user is logged in', () => {
      useAuthStore.setState({ currentUser: null });

      const store = useStore.getState();
      useStore.setState({ ecoXP: 100 });
      store.clearCache();

      expect(useStore.getState().ecoXP).toBe(0);
    });

    it('should clear cache and local storage when user is logged in (Demo Mode)', () => {
      useAuthStore.setState({
        currentUser: { uid: 'demo_user_1', email: 'demo@ecotwin.ai', displayName: 'Demo' },
        isDemoMode: true,
      });

      localStorage.setItem('ecotwin-storage_demo_user_1', 'some_persisted_data');

      const store = useStore.getState();
      useStore.setState({ ecoXP: 100 });
      store.clearCache();

      expect(useStore.getState().ecoXP).toBe(0);
      expect(localStorage.getItem('ecotwin-storage_demo_user_1')).toBeNull();
    });

    it('should clear cache and firestore when user is logged in (Firebase Mode)', async () => {
      useAuthStore.setState({
        currentUser: { uid: 'fb_user_1', email: 'fb@ecotwin.ai', displayName: 'Firebase' },
        isDemoMode: false,
      });

      const { deleteDoc } = await import('firebase/firestore');
      const store = useStore.getState();
      useStore.setState({ ecoXP: 100 });
      store.clearCache();

      expect(useStore.getState().ecoXP).toBe(0);
      
      // Wait for async dynamic imports & promises to resolve
      await vi.waitFor(() => {
        expect(deleteDoc).toHaveBeenCalled();
      });
    });

    it('should sync store changes to local storage (Demo Mode)', async () => {
      vi.useFakeTimers();
      
      const unsubscribe = startStoreSync('sync_user_1', true);
      
      useStore.setState({ ecoXP: 250 });

      // Advance timers by 1000ms
      vi.advanceTimersByTime(1000);

      const saved = localStorage.getItem('ecotwin-storage_sync_user_1');
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed.ecoXP).toBe(250);

      unsubscribe();
      vi.useRealTimers();
    });

    it('should sync store changes to Firestore (Firebase Mode)', async () => {
      vi.useFakeTimers();
      const { setDoc } = await import('firebase/firestore');
      
      const unsubscribe = startStoreSync('sync_user_2', false);
      
      useStore.setState({ ecoXP: 350 });

      // Advance timers by 1000ms
      vi.advanceTimersByTime(1000);

      // Wait for the async chain (dynamic imports + setDoc) to resolve
      await vi.waitFor(() => {
        expect(setDoc).toHaveBeenCalled();
      });

      expect(vi.mocked(setDoc).mock.calls[0][1]).toHaveProperty('ecoXP', 350);

      unsubscribe();
      vi.useRealTimers();
    });
  });
});
