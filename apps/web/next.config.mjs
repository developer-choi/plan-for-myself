import {withSentryConfig} from '@sentry/nextjs/config';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL이 없다 — apps/web/.env.example 참고');
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: 'choeyujin',
  project: 'plan-for-myself',
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
