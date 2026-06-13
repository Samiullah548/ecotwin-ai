/**
 * constants.ts
 * ────────────
 * App-wide static data: log-action presets, avatar paths, challenge
 * definitions, eco-level title table, and score grading.
 *
 * Centralising these removes duplication across pages and makes the
 * data trivially unit-testable without mounting any component.
 */

// ─── Activity Log Presets ─────────────────────────────────────────────────────

export interface LogActionPreset {
  icon: string;
  label: string;
  saved: number;       // kg CO₂
  waterSaved: number;  // litres
  color: string;
}

export const LOG_ACTIONS: LogActionPreset[] = [
  { icon: 'directions_bike',    label: 'Cycled to work',      saved: 2.4, waterSaved: 0,   color: 'tertiary'  },
  { icon: 'restaurant',         label: 'Plant-based meal',    saved: 1.8, waterSaved: 500, color: 'primary'   },
  { icon: 'thermostat',         label: 'Lowered thermostat',  saved: 1.1, waterSaved: 20,  color: 'secondary' },
  { icon: 'directions_transit', label: 'Used public transit', saved: 1.5, waterSaved: 0,   color: 'tertiary'  },
  { icon: 'recycling',          label: 'Recycled waste',      saved: 0.5, waterSaved: 15,  color: 'primary'   },
  { icon: 'solar_power',        label: 'Used solar energy',   saved: 3.2, waterSaved: 0,   color: 'secondary' },
];

// ─── Avatar Options ───────────────────────────────────────────────────────────

export const AVATAR_OPTIONS: string[] = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
];

export const DEFAULT_AVATAR = AVATAR_OPTIONS[0];

// ─── Challenges ───────────────────────────────────────────────────────────────

export interface Challenge {
  id: number;
  title: string;
  desc: string;
  points: number;
  icon: string;
}

export const CHALLENGES: Challenge[] = [
  { id: 1, title: 'Meatless Monday', desc: 'Eat plant-based meals all day.',   points: 50,  icon: 'restaurant'     },
  { id: 2, title: 'Active Transit',  desc: 'Walk or bike instead of driving.', points: 30,  icon: 'directions_bike' },
  { id: 3, title: 'Energy Saver',    desc: 'Turn off AC/Heating for 4 hours.', points: 40,  icon: 'thermostat'     },
  { id: 4, title: 'Zero Waste Day',  desc: 'Produce no landfill waste today.', points: 100, icon: 'recycling'      },
];

/** Quick lookup: challenge id → point value */
export const CHALLENGE_POINTS_MAP: Record<number, number> = Object.fromEntries(
  CHALLENGES.map((c) => [c.id, c.points]),
);

// ─── Eco Level / Title Table ──────────────────────────────────────────────────

interface LevelTier {
  maxLevel: number;
  title: string;
}

const LEVEL_TIERS: LevelTier[] = [
  { maxLevel: 3,        title: 'Seed Planter'     },
  { maxLevel: 7,        title: 'Eco Guardian'     },
  { maxLevel: 12,       title: 'Forest Guardian'  },
  { maxLevel: 16,       title: 'Climate Champion' },
  { maxLevel: Infinity, title: 'Earth Steward'    },
];

/**
 * Returns the eco title string for a given level number.
 * Single source of truth — previously duplicated in useStore and the
 * persist merge function.
 */
export function getTitleForLevel(level: number): string {
  return LEVEL_TIERS.find((t) => level <= t.maxLevel)?.title ?? 'Earth Steward';
}

// ─── Score Grade Table ────────────────────────────────────────────────────────

/**
 * Maps an eco score (0–100) to a letter grade string.
 * Exported here and re-exported from useStore for backward compatibility.
 */
export function getScoreGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}
