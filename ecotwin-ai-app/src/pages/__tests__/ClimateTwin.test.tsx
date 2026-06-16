import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ClimateTwin } from '../ClimateTwin';
import { useStore } from '../../store/useStore';

describe('ClimateTwin Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    useStore.getState().resetProgress();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render page, header, avatar, and growth status', () => {
    render(
      <MemoryRouter>
        <ClimateTwin />
      </MemoryRouter>
    );

    expect(screen.getByText('Climate Twin')).toBeInTheDocument();
    expect(screen.getByText('Current Eco Level')).toBeInTheDocument();
    expect(screen.getByText('Growth Progression')).toBeInTheDocument();
    expect(screen.getByText('Live Sync Active')).toBeInTheDocument();
  });

  it('should log built-in actions and update store metrics', async () => {
    render(
      <MemoryRouter>
        <ClimateTwin />
      </MemoryRouter>
    );

    // Log Zero-Emission Transit
    const transitButton = screen.getByLabelText('Log zero-emission transit action');
    fireEvent.click(transitButton);

    // Button should show loading state
    expect(screen.getByText('Logging Transit...')).toBeInTheDocument();

    // Fast-forward 800ms logging delay
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    // Check success text
    expect(screen.getByText('Logged Transit!')).toBeInTheDocument();

    // Verify activity feed logs the action and store has updated
    const storeState = useStore.getState();
    expect(storeState.activityLog).toHaveLength(1);
    expect(storeState.activityLog[0].label).toBe('Zero-Emission Transit');
  });

  it('should log custom action via modal', async () => {
    render(
      <MemoryRouter>
        <ClimateTwin />
      </MemoryRouter>
    );

    // Click custom action to open modal
    fireEvent.click(screen.getByLabelText('Log a custom sustainable action'));

    expect(screen.getByText('Log Custom Action')).toBeInTheDocument();

    // Fill Custom Action Form
    fireEvent.change(screen.getByLabelText('Action Name'), { target: { value: 'Watered plants' } });
    fireEvent.change(screen.getByLabelText('CO₂ Saved (kg)'), { target: { value: '2.5' } });
    fireEvent.change(screen.getByLabelText('Water Conserved (L)'), { target: { value: '20' } });

    // Submit custom action
    fireEvent.click(screen.getByText('Log Action'));

    // Verify that store activity was logged
    const storeState = useStore.getState();
    expect(storeState.activityLog).toHaveLength(1);
    expect(storeState.activityLog[0].label).toBe('Watered plants');
    expect(storeState.activityLog[0].saved).toBe(2.5);
    expect(storeState.activityLog[0].waterSaved).toBe(20);
  });
});
