import {withSentryConfig} from '@sentry/nextjs/config';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: 'choeyujin',
  project: 'plan-for-myself',
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
