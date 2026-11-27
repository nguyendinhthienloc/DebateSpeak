// Local-only: the normal dev server plus the in-memory mock API.
// Run from web/:  npx vite --config mock-local/vite.mock.config.ts
import { defineConfig, mergeConfig } from 'vite';
import base from '../vite.config';
import { mockApi } from './mockApi';

process.env.VITE_API_BASE_URL = '/api/v1';

export default mergeConfig(base, defineConfig({ plugins: [mockApi()], server: { port: 5174, strictPort: true } }));
