import {config} from 'dotenv';
import {defineConfig} from 'drizzle-kit';
import baseConfig from './drizzle.config';

config({path: '.env.local', quiet: true});

const url = process.env.POSTGRES_URL_NON_POOLING;
if (!url) {
  throw new Error(
    'POSTGRES_URL_NON_POOLING이 비어 있어 마이그레이션하지 않는다. apps/api/.env.local에 Neon 직접 연결 주소를 넣는다',
  );
}

export default defineConfig({
  ...baseConfig,
  dbCredentials: {url},
});
