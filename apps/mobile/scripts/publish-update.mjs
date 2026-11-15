// 사용법: publish-update.md (같은 폴더)
// 업데이트 묶음의 소스맵은 빌드 때처럼 자동으로 올라가지 않아, 업데이트와 소스맵 업로드를 한 명령으로 묶어 올리기를 잊지 않게 한다.
// 업데이트는 `eas update`를 직접 실행하지 않고 이 스크립트로만 내보낸다.
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const SOURCEMAPS_ONLY_FLAG = '--sourcemaps-only';
const USAGE_PATH = fileURLToPath(new URL('publish-update.md', import.meta.url));

const require = createRequire(import.meta.url);
const uploadScript = require.resolve('@sentry/react-native/scripts/expo-upload-sourcemaps.js');
const requireFromUpload = createRequire(uploadScript);

const arg = process.argv[2];
const sourcemapsOnly = arg === SOURCEMAPS_ONLY_FLAG;

if (!arg) {
  console.error(`업데이트 메시지가 없어 아무것도 내보내지 않았다. ${USAGE_PATH}`);
  process.exit(1);
}

// 아래 두 점검은 업데이트를 내보내기 전에 끝낸다. 업데이트가 나간 뒤 업로드에서 막히면 소스맵 없는 업데이트가 남는다

// 업로드 스크립트가 기본으로 실행하는 @sentry/cli/bin/sentry-cli는 node 스크립트라 Windows에서 바로 실행되지 않는다(ENOENT).
// 업로드 스크립트가 쓰는 @sentry/cli의 OS별 실행 파일 경로를 넘긴다. 못 찾으면 getPath가 throw해 아무것도 나가지 않는다
process.env.SENTRY_CLI_EXECUTABLE ??= requireFromUpload('@sentry/cli').SentryCli.getPath();

if (!hasSentryAuthToken()) {
  console.error(`SENTRY_AUTH_TOKEN이 없어 아무것도 내보내지 않았다. ${USAGE_PATH}`);
  process.exit(1);
}

if (!sourcemapsOnly) {
  run(require.resolve('eas-cli/bin/run'), [
    'update',
    '--channel',
    'production',
    '--environment',
    'production',
    // 스토어 앱은 안드로이드뿐이다. 기본값(all)이면 iOS 번들까지 만들어, iOS에서만 깨지는 코드가 안드로이드 업데이트를 막는다
    '--platform',
    'android',
    '--message',
    arg,
    '--non-interactive',
  ]);
}

run(uploadScript, ['dist'], () => {
  // 다시 실행하면 같은 업데이트가 한 번 더 나가므로 업로드만 다시 하게 안내한다
  console.error(
    `업데이트는 이미 나갔다. 소스맵만 다시 올리려면 apps/mobile에서 yarn update:production ${SOURCEMAPS_ONLY_FLAG}`,
  );
});

function run(script, args, onFail) {
  // shell을 거치지 않아 메시지의 따옴표·공백이 그대로 넘어간다
  const {status, error} = spawnSync(process.execPath, [script, ...args], {stdio: 'inherit'});

  if (status !== 0) {
    if (error) {
      console.error(error);
    }
    onFail?.();
    process.exit(status ?? 1);
  }
}

// 업로드 스크립트가 토큰을 찾는 곳(환경 변수, @expo/env가 development 모드로 읽는 .env 파일들, .env.sentry-build-plugin)을 같은 순서로 본다.
// 업로드 스크립트처럼 NODE_ENV를 바꾸지 않는다. 바꾸면 이 프로세스에서 띄우는 eas update에까지 넘어간다
function hasSentryAuthToken() {
  if (process.env.SENTRY_AUTH_TOKEN) {
    return true;
  }

  const mode = process.env.NODE_ENV || 'development';
  const {env} = requireFromUpload('@expo/env').parseProjectEnv('.', {mode, silent: true});

  if (env.SENTRY_AUTH_TOKEN) {
    return true;
  }

  const pluginEnvPath = '.env.sentry-build-plugin';

  return (
    existsSync(pluginEnvPath) &&
    Boolean(requireFromUpload('dotenv').parse(readFileSync(pluginEnvPath, 'utf-8')).SENTRY_AUTH_TOKEN)
  );
}
