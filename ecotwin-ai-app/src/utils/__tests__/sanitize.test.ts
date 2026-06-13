/**
 * sanitize.test.ts
 * ────────────────
 * Unit tests for all sanitisation helpers in utils/sanitize.ts.
 * Run with: npm run test
 */
import { describe, it, expect } from 'vitest';
import { sanitizeAvatar, sanitizeText, isValidEmail, clampNumber, clampValue } from '../sanitize';

// ─── sanitizeAvatar ───────────────────────────────────────────────────────────

describe('sanitizeAvatar', () => {
  const DEFAULT = '/avatars/avatar-1.svg';

  it('returns DEFAULT for null', () => {
    expect(sanitizeAvatar(null)).toBe(DEFAULT);
  });

  it('returns DEFAULT for undefined', () => {
    expect(sanitizeAvatar(undefined)).toBe(DEFAULT);
  });

  it('returns DEFAULT for empty string', () => {
    expect(sanitizeAvatar('')).toBe(DEFAULT);
  });

  it('blocks blob: URLs', () => {
    expect(sanitizeAvatar('blob:http://localhost/abc')).toBe(DEFAULT);
  });

  it('blocks data: URLs', () => {
    expect(sanitizeAvatar('data:image/png;base64,abc')).toBe(DEFAULT);
  });

  it('blocks javascript: URLs', () => {
    expect(sanitizeAvatar('javascript:alert(1)')).toBe(DEFAULT);
  });

  it('blocks vbscript: URLs', () => {
    expect(sanitizeAvatar('vbscript:msgbox(1)')).toBe(DEFAULT);
  });

  it('blocks Windows absolute paths (C:\\)', () => {
    expect(sanitizeAvatar('C:\\Users\\test\\avatar.png')).toBe(DEFAULT);
  });

  it('blocks Windows paths in URL form (/C:/)', () => {
    expect(sanitizeAvatar('/C:/Users/test/avatar.png')).toBe(DEFAULT);
  });

  it('blocks paths containing .gemini', () => {
    expect(sanitizeAvatar('/some/.gemini/file.svg')).toBe(DEFAULT);
  });

  it('blocks paths containing /antigravity-ide/', () => {
    expect(sanitizeAvatar('/antigravity-ide/brain/test.svg')).toBe(DEFAULT);
  });

  it('accepts valid relative paths', () => {
    expect(sanitizeAvatar('/avatars/avatar-2.svg')).toBe('/avatars/avatar-2.svg');
  });

  it('accepts https URLs', () => {
    expect(sanitizeAvatar('https://cdn.example.com/avatar.png')).toBe('https://cdn.example.com/avatar.png');
  });
});

// ─── sanitizeText ─────────────────────────────────────────────────────────────

describe('sanitizeText', () => {
  it('escapes &', () => {
    expect(sanitizeText('A & B')).toBe('A &amp; B');
  });

  it('escapes <', () => {
    expect(sanitizeText('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes >', () => {
    expect(sanitizeText('x > y')).toBe('x &gt; y');
  });

  it('escapes double quotes', () => {
    expect(sanitizeText('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeText("it's fine")).toBe("it&#x27;s fine");
  });

  it('escapes a full XSS payload', () => {
    const payload = '<img src=x onerror="alert(\'XSS\')">';
    const result = sanitizeText(payload);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('"');
  });

  it('returns plain text unchanged', () => {
    expect(sanitizeText('Hello World')).toBe('Hello World');
  });
});

// ─── isValidEmail ─────────────────────────────────────────────────────────────

describe('isValidEmail', () => {
  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('returns false for string with no @', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });

  it('returns false for @ at position 0', () => {
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  it('returns false for domain with no dot', () => {
    expect(isValidEmail('user@localhost')).toBe(false);
  });

  it('accepts a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts an email with subdomain', () => {
    expect(isValidEmail('a@b.co.uk')).toBe(true);
  });
});

// ─── clampNumber ──────────────────────────────────────────────────────────────

describe('clampNumber', () => {
  it('returns defaultValue for NaN input', () => {
    expect(clampNumber('abc', 0, 100, 50)).toBe(50);
  });

  it('clamps below min to min', () => {
    expect(clampNumber('-5', 0, 100)).toBe(0);
  });

  it('clamps above max to max', () => {
    expect(clampNumber('200', 0, 100)).toBe(100);
  });

  it('returns value when in range', () => {
    expect(clampNumber('42', 0, 100)).toBe(42);
  });

  it('uses default of 0 when no defaultValue specified', () => {
    expect(clampNumber('xyz', 0, 100)).toBe(0);
  });
});

// ─── clampValue ───────────────────────────────────────────────────────────────

describe('clampValue', () => {
  it('returns defaultValue for NaN', () => {
    expect(clampValue(NaN, 0, 100, 50)).toBe(50);
  });

  it('returns defaultValue for Infinity', () => {
    expect(clampValue(Infinity, 0, 100, 50)).toBe(50);
  });

  it('clamps below min', () => {
    expect(clampValue(-10, 0, 100)).toBe(0);
  });

  it('clamps above max', () => {
    expect(clampValue(150, 0, 100)).toBe(100);
  });

  it('passes through values within range', () => {
    expect(clampValue(75, 0, 100)).toBe(75);
  });
});
