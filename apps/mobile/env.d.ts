// Expo가 빌드 때 인라인하는 EXPO_PUBLIC_* 환경변수의 타입. 적지 않으면 process.env의 키가 any로 풀린다
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?: string;
  }
}
