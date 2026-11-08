import expoConfig from 'eslint-config-expo/flat.js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import {configs as tseslintConfigs} from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';
import {baseRules, testFilesConfig} from '../../eslint.config.base.mts';

export default defineConfig([
  expoConfig,
  ...pluginQuery.configs['flat/recommended'],
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
  {
    files: testFilesConfig.files,
    rules: {
      'no-restricted-syntax': testFilesConfig.rules['no-restricted-syntax'].filter(
        (entry) => !isEachRestriction(entry),
      ),
    },
  },
]);

/* 공유 규칙은 each 대신 Vitest의 for를 쓰게 하는데, 앱 러너인 Jest에는 for가 없다 */
function isEachRestriction(entry) {
  return typeof entry === 'object' && entry.selector.includes("name='each'");
}
