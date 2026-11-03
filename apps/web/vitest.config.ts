import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'seed/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
    env: {AUTH_SECRET: 'test-auth-secret-for-vitest-only-32bytes+', AUTH_GOOGLE_ID: ''},
    server: {deps: {inline: ['next-auth']}},
  },
});
