import {defineRailway, github, preserve, project, service} from 'railway/iac';

export default defineRailway((context) => {
  const isProduction = context.environment === 'production';

  const api = service('api', {
    // 파일에 source가 없으면 apply가 대시보드에서 연결한 GitHub 소스를 null로 되돌린다(plan에 `→ null`로 나온다). staging은 railway up으로 올려 연결하지 않는다
    ...(isProduction && {source: github('developer-choi/plan-for-myself', {branch: 'master'})}),
    build: {builder: 'DOCKERFILE', dockerfilePath: '/apps/api/Dockerfile'},
    deploy: {drainingSeconds: 10},
    healthcheck: '/health',
    replicas: {'asia-southeast1-eqsg3a': 1},
    env: {
      SENTRY_ENABLED: 'true',
      SENTRY_ENVIRONMENT: `api-${context.environment}`,
      POSTGRES_URL: preserve(),
      SENTRY_DSN: preserve(),
      AUTH_SECRET: preserve(),
      AUTH_GOOGLE_ID: preserve(),
      CORS_ORIGINS: preserve(),
    },
  });

  return project('terrific-flow', {
    resources: [api],
  });
});
