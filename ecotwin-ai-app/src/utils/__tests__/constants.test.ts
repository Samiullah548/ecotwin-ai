/**
 * constants.test.ts
 * ─────────────────
 * Unit tests for the lookup/utility functions in utils/constants.ts.
 * Run with: npm run test
 */
import { describe, it, expect } from 'vitest';
import {
  getTitleForLevel,
  getScoreGrade,
  CHALLENGES,
  CHALLENGE_POINTS_MAP,
  LOG_ACTIONS,
  AVATAR_OPTIONS,
  DEFAULT_AVATAR,
} from '../constants';

// ─── getTitleForLevel ─────────────────────────────────────────────────────────

describe('getTitleForLevel', () => {
  it('returns "Seed Planter" for level 1', () => {
    expect(getTitleForLevel(1)).toBe('Seed Planter');
  });

  it('returns "Seed Planter" for level 3 (tier boundary)', () => {
    expect(getTitleForLevel(3)).toBe('Seed Planter');
  });

  it('returns "Eco Guardian" for level 4', () => {
    expect(getTitleForLevel(4)).toBe('Eco Guardian');
  });

  it('returns "Eco Guardian" for level 7 (tier boundary)', () => {
    expect(getTitleForLevel(7)).toBe('Eco Guardian');
  });

  it('returns "Forest Guardian" for level 8', () => {
    expect(getTitleForLevel(8)).toBe('Forest Guardian');
  });

  it('returns "Forest Guardian" for level 12 (tier boundary)', () => {
    expect(getTitleForLevel(12)).toBe('Forest Guardian');
  });

  it('returns "Climate Champion" for level 13', () => {
    expect(getTitleForLevel(13)).toBe('Climate Champion');
  });

  it('returns "Climate Champion" for level 16 (tier boundary)', () => {
    expect(getTitleForLevel(16)).toBe('Climate Champion');
  });

  it('returns "Earth Steward" for level 17+', () => {
    expect(getTitleForLevel(17)).toBe('Earth Steward');
    expect(getTitleForLevel(100)).toBe('Earth Steward');
  });
});

// ─── getScoreGrade ────────────────────────────────────────────────────────────

describe('getScoreGrade', () => {
  it('returns A+ for score >= 90', () => {
    expect(getScoreGrade(90)).toBe('A+');
    expect(getScoreGrade(100)).toBe('A+');
  });

  it('returns A for score 80–89', () => {
    expect(getScoreGrade(80)).toBe('A');
    expect(getScoreGrade(89)).toBe('A');
  });

  it('returns B+ for score 70–79', () => {
    expect(getScoreGrade(70)).toBe('B+');
    expect(getScoreGrade(79)).toBe('B+');
  });

  it('returns B for score 60–69', () => {
    expect(getScoreGrade(60)).toBe('B');
    expect(getScoreGrade(69)).toBe('B');
  });

  it('returns C for score 50–59', () => {
    expect(getScoreGrade(50)).toBe('C');
    expect(getScoreGrade(59)).toBe('C');
  });

  it('returns D for score below 50', () => {
    expect(getScoreGrade(49)).toBe('D');
    expect(getScoreGrade(0)).toBe('D');
  });
});

// ─── CHALLENGE_POINTS_MAP ─────────────────────────────────────────────────────

describe('CHALLENGE_POINTS_MAP', () => {
  it('contains an entry for every challenge', () => {
    for (const challenge of CHALLENGES) {
      expect(CHALLENGE_POINTS_MAP[challenge.id]).toBe(challenge.points);
    }
  });

  it('has the correct point value for Meatless Monday (id=1)', () => {
    expect(CHALLENGE_POINTS_MAP[1]).toBe(50);
  });

  it('has the correct point value for Zero Waste Day (id=4)', () => {
    expect(CHALLENGE_POINTS_MAP[4]).toBe(100);
  });
});

// ─── Static data integrity ────────────────────────────────────────────────────

describe('LOG_ACTIONS', () => {
  it('has at least one entry', () => {
    expect(LOG_ACTIONS.length).toBeGreaterThan(0);
  });

  it('every action has required fields', () => {
    for (const action of LOG_ACTIONS) {
      expect(action.icon).toBeTruthy();
      expect(action.label).toBeTruthy();
      expect(typeof action.saved).toBe('number');
      expect(typeof action.waterSaved).toBe('number');
      expect(action.color).toBeTruthy();
    }
  });
});

describe('AVATAR_OPTIONS', () => {
  it('has at least one avatar', () => {
    expect(AVATAR_OPTIONS.length).toBeGreaterThan(0);
  });

  it('DEFAULT_AVATAR is the first option', () => {
    expect(DEFAULT_AVATAR).toBe(AVATAR_OPTIONS[0]);
  });

  it('all paths start with /avatars/', () => {
    for (const av of AVATAR_OPTIONS) {
      expect(av.startsWith('/avatars/')).toBe(true);
    }
  });
});
