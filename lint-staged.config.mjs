// 패키지 ESLint 설정의 files·ignores 경로(예: 'src/date/lunar.ts')는 ESLint를 실행한 폴더 기준으로 풀린다.
// 루트에서 --config로 돌리면 이 경로가 실제 파일(packages/shared/src/...)과 안 맞아 예외가 빠지므로,
// ESLint는 각 패키지 폴더에서 돌린다.
const quoteFiles = (files) => files.map((file) => `"${file.replaceAll('\\', '/')}"`).join(' ');
const eslintIn = (workspace) => (files) =>
  `yarn workspace ${workspace} exec eslint --fix --no-warn-ignored ${quoteFiles(files)}`;

export default {
  '*.{ts,tsx,js,mjs,mts,json,css,scss,md}': 'prettier --write',
  '**/*.{scss,css}': 'stylelint --fix --max-warnings 0 --allow-empty-input',
  'apps/web/**/*.{ts,tsx}': eslintIn('web'),
  'apps/mobile/**/*.{ts,tsx}': eslintIn('mobile'),
  'packages/shared/**/*.{ts,tsx}': eslintIn('@plan-for-myself/shared'),
};
