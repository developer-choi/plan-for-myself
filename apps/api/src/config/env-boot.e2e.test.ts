import {type SpawnSyncReturns, spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, rm} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'tsdown';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';

describe('빌드한 서버의 기동 때 환경변수 검증', () => {
  let outDir: string;
  let boot: SpawnSyncReturns<string>;

  beforeAll(async () => {
    /* 번들 밖에 둔 의존성(@nestjs/* 등)을 찾으려면 api의 node_modules 위에 있어야 한다 */
    await mkdir(BUILD_PARENT_DIR, {recursive: true});
    outDir = await mkdtemp(path.join(BUILD_PARENT_DIR, 'env-boot-'));
    await build({cwd: API_ROOT, outDir, logLevel: 'silent'});
    boot = spawnSync(process.execPath, [path.join(outDir, 'main.mjs')], {
      cwd: outDir,
      env: {...process.env, AUTH_SECRET: SHORT_SECRET, POSTGRES_URL: '', PORT: '0'},
      timeout: BOOT_TIMEOUT_MS,
      encoding: 'utf8',
    });
  }, BUILD_AND_BOOT_TIMEOUT_MS);

  afterAll(async () => {
    await rm(outDir, {recursive: true, force: true});
  });

  describe('Edge cases', () => {
    it('AUTH_SECRET이 32바이트보다 짧으면 종료 코드 1로 끝나야 한다', () => {
      expect(boot.status).toBe(1);
    });

    it('AUTH_SECRET이 32바이트보다 짧으면 32바이트 이상이어야 한다는 문구를 남겨야 한다', () => {
      expect(boot.stderr).toContain('AUTH_SECRET은 32바이트 이상이어야 한다');
    });

    it('AUTH_SECRET이 32바이트보다 짧으면 그 값을 로그에 남기지 않아야 한다', () => {
      expect(boot.stdout + boot.stderr).not.toContain(SHORT_SECRET);
    });
  });
});

const API_ROOT = path.resolve(import.meta.dirname, '../..');
const BUILD_PARENT_DIR = path.join(API_ROOT, 'node_modules/.cache');
const SHORT_SECRET = 'thirty-one-bytes-test-secret-x!';
const BOOT_TIMEOUT_MS = 20_000;
const BUILD_AND_BOOT_TIMEOUT_MS = 60_000;
