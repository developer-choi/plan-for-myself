import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import checkFile from 'eslint-plugin-check-file';
import {defineConfig, globalIgnores} from 'eslint/config';
import {baseRules, mockFilesConfig, testFilesConfig} from '../../eslint.config.base.mts';

export default defineConfig([
  // lunar.ts는 음력 변환표를 한 번 옮겨 두고 더 고치지 않는 파일이라 ESLint 대상에서 뺀다
  globalIgnores(['dist', '**/*.d.ts', 'src/date/lunar.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'check-file': checkFile,
    },
    // react 플러그인은 baseRules의 react/* 룰 때문에 둔다. 공통 패키지에는 react 의존성이 없어 버전을 적어 준다
    settings: {react: {version: '19'}},
    rules: {
      ...baseRules,
      'check-file/folder-naming-convention': ['error', {'src/**/*': 'KEBAB_CASE'}],
    },
  },
  testFilesConfig,
  mockFilesConfig,
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {selector: 'default', format: ['camelCase']},
        {selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase']},
        {selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow'},
        {selector: 'function', format: ['camelCase', 'PascalCase']},
        {selector: 'typeLike', format: ['PascalCase']},
        {selector: 'property', filter: {regex: '^aria-', match: true}, format: null},
        {selector: 'property', format: ['camelCase', 'UPPER_CASE']},
        {selector: 'method', format: ['camelCase']},
        {selector: 'import', format: null},
        {selector: 'variable', modifiers: ['destructured'], format: null},
      ],
    },
  },
]);
