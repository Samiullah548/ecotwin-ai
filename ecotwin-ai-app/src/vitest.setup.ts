import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock offsetParent for JSDOM focus trap support
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  get() {
    return this.parentNode;
  },
});

// Mock Canvas getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  write: vi.fn(),
});

// Mock Recharts to avoid layout issues in JSDOM
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }: any) => React.createElement('div', { className: 'recharts-responsive-container' }, children),
    AreaChart: ({ children, data }: any) => React.createElement('div', { 'data-testid': 'area-chart', 'data-data': JSON.stringify(data) }, children),
    Area: () => React.createElement('div', { className: 'recharts-area' }),
    XAxis: () => React.createElement('div', { className: 'recharts-xaxis' }),
    YAxis: () => React.createElement('div', { className: 'recharts-yaxis' }),
    CartesianGrid: () => React.createElement('div', { className: 'recharts-cartesiangrid' }),
    Tooltip: ({ formatter, active, payload }: any) => {
      if (active && payload && payload.length && formatter) {
        const [value] = formatter(payload[0].value);
        return React.createElement('div', { className: 'recharts-tooltip' }, value);
      }
      return React.createElement('div', { className: 'recharts-tooltip' });
    },
    PieChart: ({ children }: any) => React.createElement('div', { 'data-testid': 'pie-chart' }, children),
    Pie: ({ data, children }: any) => React.createElement('div', { className: 'recharts-pie', 'data-data': JSON.stringify(data) }, children),
    Cell: () => React.createElement('div', { className: 'recharts-cell' }),
  };
});

// Mock Firebase initialization
vi.mock('../firebase', () => ({
  app: {},
  auth: {
    onAuthStateChanged: vi.fn(() => vi.fn()),
    currentUser: null,
  },
  db: {},
}));
vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: {} })),
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({})),
    signOut: vi.fn(() => Promise.resolve()),
    sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
    updateProfile: vi.fn(() => Promise.resolve()),
    onAuthStateChanged: vi.fn((_authInstance, callback) => {
      callback(null);
      return vi.fn();
    }),
  };
});
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  deleteDoc: vi.fn(() => Promise.resolve()),
  setDoc: vi.fn(() => Promise.resolve()),
}));
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));
