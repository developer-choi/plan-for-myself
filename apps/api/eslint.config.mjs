import globals from 'globals';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import checkFile from 'eslint-plugin-check-file';
import {defineConfig, globalIgnores} from 'eslint/config';
import {baseRules, testFilesConfig} from '../../eslint.config.base.mts';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'check-file': checkFile,
    },
    // react 플러그인은 baseRules의 react/* 룰 때문에 둔다. 서버에는 react가 없어 버전을 적어 준다
    settings: {react: {version: '19'}},
    rules: {
      ...baseRules,
      'check-file/folder-naming-convention': ['error', {'src/**/*': 'KEBAB_CASE'}],
    },
  },
  testFilesConfig,
]);
