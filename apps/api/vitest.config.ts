import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    /* e2e가 PGlite와 앱을 띄우는 데 오래 걸려, 다른 패키지 테스트와 같이 돌면 기본 제한(테스트 5초, hook 10초)을 넘긴다 */
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
