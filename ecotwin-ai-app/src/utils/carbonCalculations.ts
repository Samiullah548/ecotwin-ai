/**
 * carbonCalculations.ts
 * ─────────────────────
 * Pure functions for all carbon-footprint mathematics, chart-data helpers,
 * and report generation.
 *
 * Separating these from UI code means:
 *  - Pages stay lean and focused on rendering
 *  - Calculations can be unit-tested without mounting React components
 *  - Report generation is a single, auditable code path
 */

import type { ActivityEntry, EmissionBreakdown } from '../store/useStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssessmentInputs {
  commute: string;
  distance: string;
  energy: string;
  homeSize: string;
  diet: string;
  shopping: string;
  recycling: string;
}

export interface FootprintResult {
  footprint: number;
  breakdown: EmissionBreakdown;
  score: number;
  monthlyProgress: number;
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface ReportData {
  name: string;
  email: string;
  role: string;
  ecoLevel: number;
  ecoTitle: string;
  ecoScore: number;
  grade: string;
  carbonFootprint: number;
  monthlyProgress: number;
  emissionBreakdown: EmissionBreakdown;
  activityLog: ActivityEntry[];
}

// ─── Monthly Emissions Chart Helper ──────────────────────────────────────────

/**
 * Generates per-month emission data points from a total annual footprint.
 * Applies a subtle sine-wave variance so the chart looks organic.
 * Only returns data for months up to and including the current month.
 */
export function generateMonthlyEmissions(carbonFootprint: number): MonthlyDataPoint[] {
  const monthly = carbonFootprint / 12;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return MONTHS.slice(0, currentMonth + 1).map((month, i) => {
    const variance = 0.8 + Math.sin(i * 0.9) * 0.15;
    return { month, value: parseFloat((monthly * variance).toFixed(2)) };
  });
}

// ─── Donut Chart Helper ───────────────────────────────────────────────────────

/** Maps the emission breakdown object to Recharts Pie data entries. */
export function buildDonutData(breakdown: EmissionBreakdown): DonutDataPoint[] {
  return [
    { name: 'Transport',   value: breakdown.transport, color: '#d3fe32' },
    { name: 'Home Energy', value: breakdown.home,      color: '#b0cdc2' },
    { name: 'Diet',        value: breakdown.diet,      color: '#afc6ff' },
    { name: 'Lifestyle',   value: breakdown.lifestyle, color: '#424845' },
  ];
}

// ─── Carbon Footprint Calculator ──────────────────────────────────────────────

/**
 * Calculates an annual carbon footprint from the carbon-assessment answers.
 * Returns the footprint, a percentage breakdown, an eco score, and the
 * month-over-month progress estimate.
 *
 * All coefficients are illustrative and based on publicly available
 * per-capita emission factors.
 */
export function calculateFootprint(inputs: AssessmentInputs): FootprintResult {
  // — Transport —
  let transportEmissions = 0;
  if (inputs.commute === 'car_gas')  transportEmissions += 4.2;
  else if (inputs.commute === 'ev')       transportEmissions += 1.2;
  else if (inputs.commute === 'transit')  transportEmissions += 0.8;
  else if (inputs.commute === 'active')   transportEmissions += 0.1;

  const dist = parseFloat(inputs.distance) || 0;
  if (inputs.commute === 'car_gas') transportEmissions += dist * 52 * 0.00015;
  else if (inputs.commute === 'ev') transportEmissions += dist * 52 * 0.00005;

  // — Home energy —
  let homeEmissions = 0;
  if (inputs.energy === 'gas')       homeEmissions += 3.5;
  else if (inputs.energy === 'electric')  homeEmissions += 2.2;
  else if (inputs.energy === 'renewable') homeEmissions += 0.3;
  const size = parseFloat(inputs.homeSize) || 0;
  homeEmissions += size * 0.0008;

  // — Diet —
  let dietEmissions = 0;
  if (inputs.diet === 'meat_heavy')   dietEmissions += 2.8;
  else if (inputs.diet === 'omnivore')     dietEmissions += 1.6;
  else if (inputs.diet === 'vegetarian')   dietEmissions += 0.5;

  // — Lifestyle —
  let lifestyleEmissions = 1.0;
  if (inputs.shopping === 'frequent') lifestyleEmissions += 1.8;
  else if (inputs.shopping === 'average')  lifestyleEmissions += 0.9;
  else if (inputs.shopping === 'rare')     lifestyleEmissions += 0.2;
  if (inputs.recycling === 'none') lifestyleEmissions += 0.8;
  else if (inputs.recycling === 'some')  lifestyleEmissions += 0.3;

  const totalRaw = transportEmissions + homeEmissions + dietEmissions + lifestyleEmissions;
  const footprint = Math.min(25, Math.max(1.5, parseFloat(totalRaw.toFixed(1))));

  const breakdown: EmissionBreakdown = {
    transport: Math.round((transportEmissions / totalRaw) * 100),
    home:      Math.round((homeEmissions      / totalRaw) * 100),
    diet:      Math.round((dietEmissions      / totalRaw) * 100),
    lifestyle: Math.round((lifestyleEmissions / totalRaw) * 100),
  };

  // Normalise percentages to exactly 100%
  const bSum = breakdown.transport + breakdown.home + breakdown.diet + breakdown.lifestyle;
  if (bSum !== 100) breakdown.lifestyle += (100 - bSum);

  const score = Math.min(99, Math.max(15, Math.round(100 - footprint * 3.5)));
  const monthlyProgress = Math.round(Math.max(0, (10 - footprint) * 2));

  return { footprint, breakdown, score, monthlyProgress };
}

// ─── Report Generation ────────────────────────────────────────────────────────

/** Generates the lines array for a plain-text sustainability report. */
export function generateReportLines(data: ReportData): string[] {
  return [
    'EcoTwin AI — Sustainability Report',
    '='.repeat(40),
    `Generated: ${new Date().toLocaleDateString()}`,
    '',
    'USER PROFILE',
    `  Name:      ${data.name}`,
    `  Email:     ${data.email}`,
    `  Role:      ${data.role}`,
    `  Eco Level: ${data.ecoLevel} — ${data.ecoTitle}`,
    `  Eco Score: ${data.ecoScore}/100 (${data.grade})`,
    `  Carbon Footprint: ${data.carbonFootprint}t CO₂/year`,
    `  Monthly Progress: ${data.monthlyProgress}% reduction`,
    '',
    'EMISSION BREAKDOWN',
    `  Transport:   ${data.emissionBreakdown.transport}%`,
    `  Home Energy: ${data.emissionBreakdown.home}%`,
    `  Diet:        ${data.emissionBreakdown.diet}%`,
    `  Lifestyle:   ${data.emissionBreakdown.lifestyle}%`,
    '',
    'RECENT ACTIVITIES',
    ...data.activityLog.slice(0, 5).map((a) => `  • ${a.label} — saved ${a.saved || 0}kg CO₂ (${a.date})`),
    '',
    'RECOMMENDATIONS',
    `  1. Switch to renewable energy to reduce home emissions by up to ${Math.round(data.emissionBreakdown.home * 0.6)}%.`,
    `  2. Increase work-from-home days to cut transport emissions.`,
    `  3. Adopt a plant-based diet 3 days per week.`,
  ];
}

/**
 * Creates a Blob download link, clicks it, then immediately removes the
 * anchor element and revokes the object URL to prevent memory leaks.
 */
export function downloadReport(lines: string[], filename: string): void {
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);   // clean up DOM node
  URL.revokeObjectURL(url);        // release Blob memory
}
