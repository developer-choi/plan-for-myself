import {defineConfig} from 'tsdown';

export default defineConfig({
  entry: ['src/main.ts'],
  format: 'esm',
  platform: 'node',
  sourcemap: true,
  /* shared는 빌드 없는 TS 원본이라 번들에 넣어야 node가 실행할 수 있다 */
  deps: {alwaysBundle: [/^@plan-for-myself\/shared/], onlyBundle: []},
  inputOptions: (options) => ({
    ...options,
    onLog(level, log, defaultHandler) {
      const handle: typeof defaultHandler = (handledLevel, handledLog) => {
        const isUseClientDirectiveWarning =
          handledLevel === 'warn' && typeof handledLog !== 'string' && handledLog.code === 'MODULE_LEVEL_DIRECTIVE';
        if (isUseClientDirectiveWarning) {
          defaultHandler('error', handledLog);
          return;
        }
        defaultHandler(handledLevel, handledLog);
      };
      if (options.onLog) {
        options.onLog(level, log, handle);
        return;
      }
      handle(level, log);
    },
  }),
  copy: ['src/db/migrations'],
});
