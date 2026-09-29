import expoConfig from 'eslint-config-expo/flat.js';
import {configs as tseslintConfigs} from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';
import {baseRules, mockFilesConfig, testFilesConfig} from '../../eslint.config.base.mts';

export default defineConfig([
  expoConfig,
  globalIgnores(['.expo/**', 'dist/**', 'android/**', 'ios/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslintConfigs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...baseRules,
      '@typescript-eslint/no-deprecated': 'error',
    },
  },
  testFilesConfig,
  mockFilesConfig,
]);
