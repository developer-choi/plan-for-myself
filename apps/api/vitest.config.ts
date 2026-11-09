import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    /* e2e가 케이스마다 PGlite와 앱을 새로 띄워, 다른 패키지 테스트와 같이 돌면 기본 5초를 넘긴다 */
    testTimeout: 20_000,
  },
});
