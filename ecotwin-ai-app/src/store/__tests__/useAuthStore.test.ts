import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store state before each test
    localStorage.clear();
    useAuthStore.setState({
      currentUser: null,
      isInitialized: false,
      isDemoMode: true, // Force demo mode for unit testing
      error: null,
    });
  });

  it('should initialize with default states', () => {
    const state = useAuthStore.getState();
    expect(state.currentUser).toBeNull();
    expect(state.isInitialized).toBe(false);
    expect(state.isDemoMode).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should initialize auth and read cached user if present', () => {
    const mockUser = {
      uid: 'mock_123',
      email: 'test@ecotwin.ai',
      displayName: 'Test User',
    };
    localStorage.setItem('ecotwin_mock_current_user', JSON.stringify(mockUser));

    const state = useAuthStore.getState();
    state.initializeAuth();

    const updatedState = useAuthStore.getState();
    expect(updatedState.currentUser).toEqual(mockUser);
    expect(updatedState.isInitialized).toBe(true);
  });

  it('should successfully sign up a new user in demo mode', async () => {
    const state = useAuthStore.getState();
    const res = await state.signUp('Alice', 'alice@ecotwin.ai', 'password123');

    expect(res.success).toBe(true);
    
    const updatedState = useAuthStore.getState();
    expect(updatedState.currentUser).not.toBeNull();
    expect(updatedState.currentUser?.displayName).toBe('Alice');
    expect(updatedState.currentUser?.email).toBe('alice@ecotwin.ai');
    expect(updatedState.error).toBeNull();

    // Verify written to mock database
    const rawUsers = localStorage.getItem('ecotwin_mock_users');
    expect(rawUsers).not.toBeNull();
    const users = JSON.parse(rawUsers!);
    expect(users).toHaveLength(1);
    expect(users[0].displayName).toBe('Alice');
    expect(users[0].passwordHash).toBe(btoa('ecotwin-salt-password123-alice@ecotwin.ai'));
  });

  it('should fail to sign up a user with duplicate email', async () => {
    const state = useAuthStore.getState();
    
    // First signup
    await state.signUp('Alice', 'alice@ecotwin.ai', 'password123');
    
    // Second signup with same email
    const res = await state.signUp('Bob', 'alice@ecotwin.ai', 'password456');

    expect(res.success).toBe(false);
    expect(res.error).toBe('Email address already in use.');

    const updatedState = useAuthStore.getState();
    expect(updatedState.error).toBe('Email address already in use.');
  });

  it('should successfully log in a registered user', async () => {
    const state = useAuthStore.getState();
    
    // Sign up Alice first
    await state.signUp('Alice', 'alice@ecotwin.ai', 'password123');
    
    // Clear session to simulate fresh login
    localStorage.removeItem('ecotwin_mock_current_user');
    useAuthStore.setState({ currentUser: null });

    // Log in
    const loginRes = await state.login('alice@ecotwin.ai', 'password123');
    expect(loginRes.success).toBe(true);

    const updatedState = useAuthStore.getState();
    expect(updatedState.currentUser?.displayName).toBe('Alice');
    expect(updatedState.error).toBeNull();
  });

  it('should reject login with wrong credentials', async () => {
    const state = useAuthStore.getState();
    
    // Sign up Alice first
    await state.signUp('Alice', 'alice@ecotwin.ai', 'password123');
    
    // Clear session
    useAuthStore.setState({ currentUser: null });

    // Try wrong password
    const wrongPassRes = await state.login('alice@ecotwin.ai', 'wrongpassword');
    expect(wrongPassRes.success).toBe(false);
    expect(wrongPassRes.error).toBe('Invalid email or password.');

    // Try wrong email
    const wrongEmailRes = await state.login('wrong@ecotwin.ai', 'password123');
    expect(wrongEmailRes.success).toBe(false);
    expect(wrongEmailRes.error).toBe('Invalid email or password.');
  });

  it('should successfully log out an active user', async () => {
    const state = useAuthStore.getState();
    
    // Sign up and log in
    await state.signUp('Alice', 'alice@ecotwin.ai', 'password123');
    expect(useAuthStore.getState().currentUser).not.toBeNull();

    // Log out
    await useAuthStore.getState().logout();
    
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(localStorage.getItem('ecotwin_mock_current_user')).toBeNull();
  });

  it('should verify password reset email mock lookup', async () => {
    const state = useAuthStore.getState();
    
    // Reset unregistered email
    const failRes = await state.resetPassword('missing@ecotwin.ai');
    expect(failRes.success).toBe(false);
    expect(failRes.error).toBe('No user registered with this email.');

    // Sign up first
    await state.signUp('Alice', 'alice@ecotwin.ai', 'password123');
    
    // Reset registered email
    const successRes = await state.resetPassword('alice@ecotwin.ai');
    expect(successRes.success).toBe(true);
  });

  describe('Firebase Mode (Non-Demo)', () => {
    beforeEach(() => {
      useAuthStore.setState({
        currentUser: null,
        isInitialized: false,
        isDemoMode: false,
        error: null,
      });
      vi.clearAllMocks();
    });

    it('should initialize auth with Firebase onAuthStateChanged', () => {
      const state = useAuthStore.getState();
      state.initializeAuth();
      expect(useAuthStore.getState().isInitialized).toBe(true);
    });

    it('should successfully sign up a user via Firebase', async () => {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({
        user: { uid: 'fb_123', email: 'fb@ecotwin.ai' }
      } as any);

      const state = useAuthStore.getState();
      const res = await state.signUp('Firebase User', 'fb@ecotwin.ai', 'securepass');

      expect(res.success).toBe(true);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'fb@ecotwin.ai', 'securepass');
      expect(updateProfile).toHaveBeenCalledWith(expect.any(Object), { displayName: 'Firebase User' });
    });

    it('should handle Firebase sign up errors and try falling back to Demo Mode if configuration not found', async () => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/configuration-not-found',
      });

      const state = useAuthStore.getState();
      const res = await state.signUp('Fallback User', 'fallback@ecotwin.ai', 'securepass');

      // The fallback should switch to Demo Mode and succeed (using mock signUp)
      expect(res.success).toBe(true);
      expect(useAuthStore.getState().isDemoMode).toBe(true);
      expect(useAuthStore.getState().currentUser?.displayName).toBe('Fallback User');
    });

    it('should handle generic Firebase sign up failures', async () => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(new Error('Firebase network error'));

      const state = useAuthStore.getState();
      const res = await state.signUp('Error User', 'error@ecotwin.ai', 'securepass');

      expect(res.success).toBe(false);
      expect(res.error).toBe('Firebase network error');
      expect(useAuthStore.getState().error).toBe('Firebase network error');
    });

    it('should successfully log in via Firebase', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({} as any);

      const state = useAuthStore.getState();
      const res = await state.login('fb@ecotwin.ai', 'securepass');

      expect(res.success).toBe(true);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'fb@ecotwin.ai', 'securepass');
    });

    it('should handle Firebase login configuration errors by falling back to Demo Mode', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/configuration-not-found',
      });

      const state = useAuthStore.getState();
      // Need a registered user in demo mode to complete the fallback login successfully
      const mockUsers = [{
        uid: 'demo_123',
        email: 'fallback@ecotwin.ai',
        displayName: 'Fallback User',
        passwordHash: btoa('ecotwin-salt-securepass-fallback@ecotwin.ai'),
      }];
      localStorage.setItem('ecotwin_mock_users', JSON.stringify(mockUsers));

      const res = await state.login('fallback@ecotwin.ai', 'securepass');
      expect(res.success).toBe(true);
      expect(useAuthStore.getState().isDemoMode).toBe(true);
    });

    it('should handle generic Firebase login errors', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/invalid-credential',
      });

      const state = useAuthStore.getState();
      const res = await state.login('fb@ecotwin.ai', 'wrongpass');

      expect(res.success).toBe(false);
      expect(res.error).toBe('Failed to log in. Please check your credentials.');
    });

    it('should log out via Firebase', async () => {
      const { signOut } = await import('firebase/auth');
      vi.mocked(signOut).mockResolvedValueOnce();

      const state = useAuthStore.getState();
      await state.logout();

      expect(signOut).toHaveBeenCalled();
      expect(useAuthStore.getState().currentUser).toBeNull();
    });

    it('should reset password via Firebase', async () => {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      vi.mocked(sendPasswordResetEmail).mockResolvedValueOnce();

      const state = useAuthStore.getState();
      const res = await state.resetPassword('fb@ecotwin.ai');

      expect(res.success).toBe(true);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.any(Object), 'fb@ecotwin.ai');
    });

    it('should handle Firebase password reset errors', async () => {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      vi.mocked(sendPasswordResetEmail).mockRejectedValueOnce(new Error('Reset failed'));

      const state = useAuthStore.getState();
      const res = await state.resetPassword('fb@ecotwin.ai');

      expect(res.success).toBe(false);
      expect(res.error).toBe('Reset failed');
    });
  });
});
