import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import pluginQuery from '@tanstack/eslint-plugin-query';
import tseslint from 'typescript-eslint';
import checkFile from 'eslint-plugin-check-file';
import {baseRules, mockFilesConfig, testFilesConfig} from '../../eslint.config.base.mts';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs['flat/recommended'],
  ...tseslint.configs.recommendedTypeChecked,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'next.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...baseRules,
      'react-hooks/error-boundaries': 'off',
      '@typescript-eslint/no-deprecated': 'error',
      'check-file/folder-naming-convention': ['error', {'src/**/*': 'NEXT_JS_APP_ROUTER_CASE'}],
    },
    plugins: {
      'check-file': checkFile,
    },
  },
  {
    // Next.js가 redirects를 Promise를 돌려주는 async 함수로 받아서 await 없이도 async를 떼지 못한다
    files: ['next.config.mjs'],
    rules: {'@typescript-eslint/require-await': 'off'},
  },
  {
    // ESLint 설정 파일은 tsconfig 밖이라 Node 타입 없이 검사돼 import.meta.dirname이 error 타입으로 잡힌다
    files: ['eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // 기록 필드가 DB 컬럼과 같은 snake_case(StudyRecord)라 그 필드를 다루는 파일은 이름 규칙을 끈다
    files: ['seed/scenario.ts', 'seed/index.ts', 'src/utils/service/study-record/validate.ts'],
    rules: {'@typescript-eslint/naming-convention': 'off'},
  },
  testFilesConfig,
  mockFilesConfig,
]);

export default eslintConfig;
