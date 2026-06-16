import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CarbonAssessment } from '../CarbonAssessment';
import { useStore } from '../../store/useStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('CarbonAssessment Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    useStore.getState().resetProgress();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should walk through the stepper assessment successfully', () => {
    render(
      <MemoryRouter>
        <CarbonAssessment />
      </MemoryRouter>
    );

    // Initial page: Step 1 (Transport)
    expect(screen.getByText('Primary Commute Method')).toBeInTheDocument();
    
    // Choose Car, and enter commute distance
    fireEvent.click(screen.getByRole('radio', { name: /Gas\/Diesel Car/i }));
    fireEvent.change(screen.getByLabelText(/Weekly Commute Distance/i), { target: { value: '100' } });
    
    // Submit Step 1
    fireEvent.click(screen.getByText('Next'));

    // Step 2 (Home)
    expect(screen.getByText('Primary Home Energy Source')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: /Standard Grid Electric/i }));
    fireEvent.change(screen.getByLabelText(/Home Size/i), { target: { value: '2000' } });
    
    // Submit Step 2
    fireEvent.click(screen.getByText('Next'));

    // Step 3 (Diet)
    expect(screen.getByText('Diet Type')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: /Vegetarian \/ Vegan/i }));
    
    // Submit Step 3
    fireEvent.click(screen.getByText('Next'));

    // Step 4 (Lifestyle)
    expect(screen.getByText('Shopping & Waste Habits')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/How often do you buy new clothes\/electronics/i), { target: { value: 'average' } });
    fireEvent.change(screen.getByLabelText(/Recycling & Composting/i), { target: { value: 'all' } });

    // Submit Assessment
    fireEvent.click(screen.getByText('Calculate'));

    // Loading screen should appear
    expect(screen.getByText('Calculating your footprint...')).toBeInTheDocument();

    // Fast-forward timers
    act(() => {
      vi.runAllTimers();
    });

    // Verify store state updated
    const storeState = useStore.getState();
    expect(storeState.assessmentAnswers.completed).toBe(true);
    expect(storeState.assessmentAnswers.commute).toBe('car_gas');
    expect(storeState.assessmentAnswers.distance).toBe('100');
    expect(storeState.assessmentAnswers.diet).toBe('vegetarian');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
