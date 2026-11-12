import {defineRailway, preserve, project, service} from 'railway/iac';

export default defineRailway((context) => {
  const api = service('api', {
    build: {builder: 'DOCKERFILE', dockerfilePath: '/apps/api/Dockerfile'},
    deploy: {drainingSeconds: 10},
    healthcheck: '/health',
    replicas: {'asia-southeast1-eqsg3a': 1},
    env: {
      SENTRY_ENABLED: 'true',
      SENTRY_ENVIRONMENT: `api-${context.environment}`,
      POSTGRES_URL: preserve(),
      SENTRY_DSN: preserve(),
    },
  });

  return project('terrific-flow', {
    resources: [api],
  });
});
