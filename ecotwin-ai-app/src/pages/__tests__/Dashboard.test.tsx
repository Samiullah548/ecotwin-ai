import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { useStore } from '../../store/useStore';
import * as carbonCalculations from '../../utils/carbonCalculations';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.getState().resetProgress();
  });

  it('should render bento metrics and elements correctly', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
    expect(screen.getByText('Carbon Footprint')).toBeInTheDocument();
    expect(screen.getByText('Eco Score')).toBeInTheDocument();
    expect(screen.getByText('Monthly Progress')).toBeInTheDocument();
    expect(screen.getByText('Emission Trends')).toBeInTheDocument();
    expect(screen.getByText('Recent Habits')).toBeInTheDocument();
  });

  it('should trigger log modal and log a new action', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Click Log New button
    fireEvent.click(screen.getAllByLabelText('Log a new eco action')[0]);

    // Check modal opens
    expect(screen.getByText('Log Eco Action')).toBeInTheDocument();

    // Click on "Plant-based meal" action button
    const actionButton = screen.getByText('Plant-based meal');
    fireEvent.click(actionButton);

    // Modal should close and store updates
    expect(screen.queryByText('Log Eco Action')).not.toBeInTheDocument();
    
    const storeState = useStore.getState();
    expect(storeState.activityLog).toHaveLength(1);
    expect(storeState.activityLog[0].label).toBe('Plant-based meal');
  });

  it('should trigger report download', () => {
    const downloadSpy = vi.spyOn(carbonCalculations, 'downloadReport');

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const downloadButton = screen.getByLabelText('Export sustainability report');
    fireEvent.click(downloadButton);

    expect(downloadSpy).toHaveBeenCalled();
  });
});
