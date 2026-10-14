import '@testing-library/jest-dom';

// Mockear fetch global antes de cargar módulos
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
    status: 200,
    statusText: 'OK',
  })
);

import { vi } from 'vitest';
