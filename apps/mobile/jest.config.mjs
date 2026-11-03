import {fileURLToPath} from 'node:url';

export default {
  preset: 'jest-expo',
  // 변환 캐시가 없는 첫 실행은 파일의 첫 테스트가 RN 변환까지 떠안아 기본 5초를 넘는다
  testTimeout: 30_000,
  // @developer-choi/utils는 exports에 "import" 조건만 있어 Jest(require 조건)가 못 찾는다
  moduleNameMapper: {
    '^@developer-choi/utils/api$': fileURLToPath(import.meta.resolve('@developer-choi/utils/api')),
  },
  // jest-expo 기본값에 ESM으로만 배포되는 @developer-choi/utils와 그 의존성을 변환 대상으로 더한다
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry|native-base|standard-navigation|@developer-choi|query-string|decode-uri-component|split-on-first|filter-obj))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
};
