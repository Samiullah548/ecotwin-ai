import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WhatIfSimulator } from '../WhatIfSimulator';
import { useStore } from '../../store/useStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('WhatIfSimulator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.getState().resetProgress();
  });

  it('should render page headers and slider values correctly', () => {
    render(
      <MemoryRouter>
        <WhatIfSimulator />
      </MemoryRouter>
    );

    expect(screen.getByText('What-If Simulator')).toBeInTheDocument();
    expect(screen.getByText('Habit Variables')).toBeInTheDocument();
    expect(screen.getByText('Remote Work')).toBeInTheDocument();
    expect(screen.getByText('Meat Consumption')).toBeInTheDocument();
    expect(screen.getByText('Flight Frequency')).toBeInTheDocument();
  });

  it('should calculate reduction and update output values', () => {
    render(
      <MemoryRouter>
        <WhatIfSimulator />
      </MemoryRouter>
    );

    // Initial state: WFH=2, meat=14, flights=4.
    // Projected reduction: totalReduction = wfhReduction + meatReduction + flightReduction.
    // wfhReduction = (2 - 1) * 0.2 = 0.2.
    // meatReduction = (14 - 14) * 0.15 = 0.
    // flightReduction = (4 - 4) * 0.4 = 0.
    // totalReduction = 0.2.
    expect(screen.getByText('0.2')).toBeInTheDocument(); // tonnes reduction
    expect(screen.getByText('14.0t')).toBeInTheDocument(); // simulated future (14.2 - 0.2)

    // Find WFH slider input and change its value to 5
    const wfhSlider = screen.getByLabelText('Remote Work');
    fireEvent.change(wfhSlider, { target: { value: '5' } });

    // WFH reduction = (5 - 1) * 0.2 = 0.8
    // total = 0.8
    expect(screen.getByText('0.8')).toBeInTheDocument();
    expect(screen.getByText('13.4t')).toBeInTheDocument(); // simulated future (14.2 - 0.8)
  });

  it('should save simulated future footprint and score when committed', () => {
    render(
      <MemoryRouter>
        <WhatIfSimulator />
      </MemoryRouter>
    );

    const commitButton = screen.getByText('Commit to Changes');
    fireEvent.click(commitButton);

    const storeState = useStore.getState();
    expect(storeState.carbonFootprint).toBe(14.0); // baseline - 0.2
    expect(storeState.ecoScore).toBe(51); // 100 - 14.0 * 3.5 = 51
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
