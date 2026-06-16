import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '../../store/useAuthStore';

// Mock useAuthStore
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('ProtectedRoute', () => {
  it('should render loading state when auth is not initialized', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      currentUser: null,
      isInitialized: false,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    );

    expect(screen.getByText('Connecting to EcoTwin Engine...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect to /login when user is not logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      currentUser: null,
      isInitialized: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render outlet when user is logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      currentUser: { uid: '123', email: 'test@ecotwin.ai' },
      isInitialized: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
