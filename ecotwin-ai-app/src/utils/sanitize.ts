/**
 * sanitize.ts
 * ───────────
 * Security-focused helpers for sanitising user-supplied strings before
 * they are stored or rendered.
 *
 * Keeps XSS-prevention and input-validation logic in one place so it is
 * easy to audit and unit-test in isolation.
 */

import { DEFAULT_AVATAR } from './constants';

// ─── Avatar Sanitisation ──────────────────────────────────────────────────────

/**
 * Validates an avatar URL string.
 * Rejects:
 *  - blob: URLs (revoked after page reload)
 *  - data: URLs (can embed arbitrary content)
 *  - javascript: / vbscript: URLs (XSS vectors)
 *  - Absolute Windows file-system paths (C:\… or /C:/ or any /[A-Z]:/ pattern)
 *  - IDE-internal paths (.gemini / antigravity-ide)
 *
 * Returns the original string if it looks safe, otherwise falls back to
 * the default avatar path.
 */
export function sanitizeAvatar(avatar: string | undefined | null): string {
  if (!avatar) return DEFAULT_AVATAR;

  const lower = avatar.toLowerCase();

  if (
    lower.startsWith('blob:') ||
    lower.startsWith('data:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    // Windows absolute paths: C:\, D:\, /C:/, /D:/ etc.
    /^[a-z]:\\/.test(lower) ||
    /^\/[a-z]:\//.test(lower) ||
    avatar.includes('.gemini') ||
    avatar.includes('/antigravity-ide/')
  ) {
    return DEFAULT_AVATAR;
  }

  return avatar;
}

// ─── Text Sanitisation ────────────────────────────────────────────────────────

/**
 * Strips HTML-injectable characters from a free-text string.
 * Prevents stored-XSS when user-entered text is later interpolated into the DOM.
 *
 * This is a lightweight defence-in-depth measure for a client-side app;
 * server-side validation should be the primary guard in a production system.
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ─── Email Validation ─────────────────────────────────────────────────────────

/**
 * Returns true if the supplied string is a plausible email address.
 * Uses a lightweight RFC-5321 heuristic — not exhaustive, but catches
 * obviously malformed values before they enter the store.
 *
 * Rejects:
 *  - Strings with no '@' character
 *  - Strings where the domain has no dot
 *  - Empty strings
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const atIdx = email.lastIndexOf('@');
  if (atIdx <= 0) return false;
  const domain = email.slice(atIdx + 1);
  return domain.includes('.') && domain.length >= 3;
}

// ─── Numeric Clamping ─────────────────────────────────────────────────────────

/**
 * Parses a raw string as a float and clamps it within [min, max].
 * Returns `defaultValue` when the string is not a valid number.
 *
 * Use this for user-supplied numeric inputs (e.g. CO₂ saved, water conserved)
 * to prevent negative or absurdly large values from entering the store.
 */
export function clampNumber(
  raw: string,
  min: number,
  max: number,
  defaultValue = 0,
): number {
  const n = parseFloat(raw);
  if (isNaN(n)) return defaultValue;
  return Math.min(max, Math.max(min, n));
}

/**
 * Clamps an already-parsed number within [min, max].
 * Returns `defaultValue` when the value is NaN.
 *
 * Useful for clamping numeric values coming from calculations or store setters.
 */
export function clampValue(
  value: number,
  min: number,
  max: number,
  defaultValue: number = min,
): number {
  if (isNaN(value) || !isFinite(value)) return defaultValue;
  return Math.min(max, Math.max(min, value));
}
