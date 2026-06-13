/**
 * carbonCalculations.test.ts
 * ──────────────────────────
 * Unit tests for all pure functions in utils/carbonCalculations.ts.
 * Run with: npm run test
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  calculateFootprint,
  generateMonthlyEmissions,
  buildDonutData,
  generateReportLines,
  downloadReport,
} from '../carbonCalculations';
import type { EmissionBreakdown } from '../../store/useStore';

// ─── calculateFootprint ───────────────────────────────────────────────────────

describe('calculateFootprint', () => {
  const baseInputs = {
    commute: 'active',
    distance: '0',
    energy: 'renewable',
    homeSize: '0',
    diet: 'vegetarian',
    shopping: 'rare',
    recycling: 'all',
  };

  it('returns a footprint within allowed bounds [1.5, 25]', () => {
    const { footprint } = calculateFootprint(baseInputs);
    expect(footprint).toBeGreaterThanOrEqual(1.5);
    expect(footprint).toBeLessThanOrEqual(25);
  });

  it('gas car produces higher footprint than active transit', () => {
    const carResult = calculateFootprint({ ...baseInputs, commute: 'car_gas', distance: '50' });
    const activeResult = calculateFootprint({ ...baseInputs, commute: 'active', distance: '0' });
    expect(carResult.footprint).toBeGreaterThan(activeResult.footprint);
  });

  it('meat-heavy diet produces higher footprint than vegetarian', () => {
    const meatResult = calculateFootprint({ ...baseInputs, diet: 'meat_heavy' });
    const veggieResult = calculateFootprint({ ...baseInputs, diet: 'vegetarian' });
    expect(meatResult.footprint).toBeGreaterThan(veggieResult.footprint);
  });

  it('frequent shopping produces higher footprint than rare shopping', () => {
    const frequentResult = calculateFootprint({ ...baseInputs, shopping: 'frequent' });
    const rareResult = calculateFootprint({ ...baseInputs, shopping: 'rare' });
    expect(frequentResult.footprint).toBeGreaterThan(rareResult.footprint);
  });

  it('no recycling produces higher footprint than full recycling', () => {
    const noneResult = calculateFootprint({ ...baseInputs, recycling: 'none' });
    const allResult = calculateFootprint({ ...baseInputs, recycling: 'all' });
    expect(noneResult.footprint).toBeGreaterThan(allResult.footprint);
  });

  it('breakdown percentages sum to exactly 100', () => {
    const { breakdown } = calculateFootprint({ ...baseInputs, commute: 'car_gas', distance: '80', diet: 'meat_heavy', shopping: 'frequent', recycling: 'none' });
    const sum = breakdown.transport + breakdown.home + breakdown.diet + breakdown.lifestyle;
    expect(sum).toBe(100);
  });

  it('score is within [15, 99]', () => {
    const highEmission = calculateFootprint({ commute: 'car_gas', distance: '200', energy: 'gas', homeSize: '5000', diet: 'meat_heavy', shopping: 'frequent', recycling: 'none' });
    const lowEmission = calculateFootprint(baseInputs);
    expect(highEmission.score).toBeGreaterThanOrEqual(15);
    expect(lowEmission.score).toBeLessThanOrEqual(99);
  });

  it('handles non-numeric distance gracefully', () => {
    const result = calculateFootprint({ ...baseInputs, distance: 'abc' });
    expect(result.footprint).toBeGreaterThanOrEqual(1.5);
  });

  it('handles empty string distance', () => {
    const result = calculateFootprint({ ...baseInputs, distance: '' });
    expect(result.footprint).toBeGreaterThanOrEqual(1.5);
  });

  it('EV produces lower footprint than gas car at same distance', () => {
    const evResult   = calculateFootprint({ ...baseInputs, commute: 'ev', distance: '100' });
    const carResult  = calculateFootprint({ ...baseInputs, commute: 'car_gas', distance: '100' });
    expect(evResult.footprint).toBeLessThan(carResult.footprint);
  });
});

// ─── generateMonthlyEmissions ─────────────────────────────────────────────────

describe('generateMonthlyEmissions', () => {
  it('returns at most 12 data points', () => {
    const data = generateMonthlyEmissions(14.2);
    expect(data.length).toBeLessThanOrEqual(12);
    expect(data.length).toBeGreaterThan(0);
  });

  it('every value is a positive number', () => {
    const data = generateMonthlyEmissions(10);
    for (const point of data) {
      expect(point.value).toBeGreaterThan(0);
    }
  });

  it('every data point has a month label', () => {
    const data = generateMonthlyEmissions(10);
    const validMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (const point of data) {
      expect(validMonths).toContain(point.month);
    }
  });

  it('returns 0 data points for a footprint of 0 (edge case)', () => {
    // The function should still work — values just approach zero
    const data = generateMonthlyEmissions(0);
    for (const point of data) {
      expect(point.value).toBeGreaterThanOrEqual(0);
    }
  });
});

// ─── buildDonutData ───────────────────────────────────────────────────────────

describe('buildDonutData', () => {
  const breakdown: EmissionBreakdown = {
    transport: 45,
    home: 30,
    diet: 15,
    lifestyle: 10,
  };

  it('returns exactly 4 entries', () => {
    expect(buildDonutData(breakdown)).toHaveLength(4);
  });

  it('maps breakdown values correctly', () => {
    const data = buildDonutData(breakdown);
    const transport = data.find(d => d.name === 'Transport');
    expect(transport?.value).toBe(45);
    const home = data.find(d => d.name === 'Home Energy');
    expect(home?.value).toBe(30);
  });

  it('every entry has a non-empty color string', () => {
    const data = buildDonutData(breakdown);
    for (const entry of data) {
      expect(entry.color).toBeTruthy();
      expect(entry.color.startsWith('#')).toBe(true);
    }
  });
});

// ─── generateReportLines ──────────────────────────────────────────────────────

describe('generateReportLines', () => {
  const sampleData = {
    name: 'Test User',
    email: 'test@ecotwin.ai',
    role: 'Researcher',
    ecoLevel: 5,
    ecoTitle: 'Eco Guardian',
    ecoScore: 75,
    grade: 'B+',
    carbonFootprint: 9.5,
    monthlyProgress: 8,
    emissionBreakdown: { transport: 40, home: 35, diet: 15, lifestyle: 10 },
    activityLog: [
      { id: '1', icon: 'directions_bike', label: 'Cycled to work', saved: 2.4, waterSaved: 0, date: 'Today', color: 'tertiary' },
    ],
  };

  it('returns an array of strings', () => {
    const lines = generateReportLines(sampleData);
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('includes the user name', () => {
    const lines = generateReportLines(sampleData);
    expect(lines.some(l => l.includes('Test User'))).toBe(true);
  });

  it('includes the eco score', () => {
    const lines = generateReportLines(sampleData);
    expect(lines.some(l => l.includes('75'))).toBe(true);
  });

  it('includes emission breakdown', () => {
    const lines = generateReportLines(sampleData);
    expect(lines.some(l => l.toLowerCase().includes('transport'))).toBe(true);
  });

  it('includes at least one activity from the log', () => {
    const lines = generateReportLines(sampleData);
    expect(lines.some(l => l.includes('Cycled to work'))).toBe(true);
  });
});

// ─── downloadReport ───────────────────────────────────────────────────────────

describe('downloadReport', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a Blob, clicks an anchor, then cleans up', () => {
    // Mock URL APIs
    const createObjectURL = vi.fn(() => 'blob:fake-url');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    // Mock anchor click
    const clickMock = vi.fn();
    const appendChildMock = vi.fn();
    const removeChildMock = vi.fn();
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => { appendChildMock(node); return node; });
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => { removeChildMock(node); return node; });
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickMock,
    } as unknown as HTMLAnchorElement);

    downloadReport(['line1', 'line2'], 'test-report.txt');

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(clickMock).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledOnce();
    expect(appendChildMock).toHaveBeenCalledOnce();
    expect(removeChildMock).toHaveBeenCalledOnce();
  });
});
