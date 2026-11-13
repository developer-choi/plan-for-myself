import {defineConfig} from 'tsdown';

export default defineConfig({
  entry: ['src/main.ts'],
  format: 'esm',
  platform: 'node',
  sourcemap: true,
  /* shared는 빌드 없는 TS 원본이라 번들에 넣어야 node가 실행할 수 있다 */
  deps: {alwaysBundle: [/^@plan-for-myself\/shared/], onlyBundle: []},
});
