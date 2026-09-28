import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default defineConfig([
  ...nextVitals,
  ...pluginQuery.configs['flat/recommended'],
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
