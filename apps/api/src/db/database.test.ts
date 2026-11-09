import {describe, expect, it} from 'vitest';
import {resolveDatabaseOptions} from './database';

describe('resolveDatabaseOptions()', () => {
  describe('General cases', () => {
    it('postgresUrl이 있으면 그 주소로 접속하는 옵션을 반환해야 한다', () => {
      const postgresUrl = 'postgres://db';

      expect(resolveDatabaseOptions({postgresUrl})).toMatchObject({connectionString: postgresUrl});
    });

    it('postgresUrl이 없으면 로컬 폴더의 PGlite 옵션을 반환해야 한다', () => {
      expect(resolveDatabaseOptions({})).toMatchObject({dataDir: '.local-db'});
    });

    it('queryLog가 true면 쿼리 로그를 켠 옵션을 반환해야 한다', () => {
      expect(resolveDatabaseOptions({queryLog: 'true'})).toMatchObject({logQueries: true});
    });

    describe('운영일 때', () => {
      it('postgresUrl이 있으면 그 주소로 접속하는 옵션을 반환해야 한다', () => {
        const postgresUrl = 'postgres://db';

        expect(resolveDatabaseOptions({postgresUrl, nodeEnv: 'production'})).toMatchObject({
          connectionString: postgresUrl,
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('queryLog가 true가 아니면 쿼리 로그를 끈 옵션을 반환해야 한다', () => {
      expect(resolveDatabaseOptions({queryLog: 'false'})).toMatchObject({logQueries: false});
    });

    it('postgresUrl이 빈 문자열이면 로컬 폴더의 PGlite 옵션을 반환해야 한다', () => {
      expect(resolveDatabaseOptions({postgresUrl: ''})).toMatchObject({dataDir: '.local-db'});
    });

    describe('운영일 때', () => {
      it.for([
        {name: '없으면', postgresUrl: undefined},
        {name: '빈 문자열이면', postgresUrl: ''},
      ])('postgresUrl이 $name InvalidEnvError를 던져야 한다', ({postgresUrl}) => {
        expect(() => resolveDatabaseOptions({postgresUrl, nodeEnv: 'production'})).toThrow(
          expect.objectContaining({
            name: 'InvalidEnvError',
            message: '운영(NODE_ENV=production)에서는 POSTGRES_URL이 있어야 한다',
          }),
        );
      });
    });
  });
});
