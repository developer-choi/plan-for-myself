# apps/api

웹·앱이 함께 사용하는 NestJS API 서버.

## 배포 (Railway)

Railway 프로젝트 하나에 `staging`·`production` 환경을 두고, 환경마다 `api` 서비스를 둔다. 서비스 설정(production의 GitHub `master` 소스·헬스 체크·리전·변수)은 레포 루트의 `.railway/railway.ts`(Railway Infrastructure as Code)가 정한다.

### 설정 파일 밖에서 넣는 것

| 항목             | staging                              | production                           |
| ---------------- | ------------------------------------ | ------------------------------------ |
| `POSTGRES_URL`   | Neon `dev` 직접 연결                 | Neon `main` 직접 연결                |
| `SENTRY_DSN`     | 웹과 같은 프로젝트의 DSN             | 웹과 같은 프로젝트의 DSN             |
| `AUTH_SECRET`    | 웹과 다른 새 값                      | 웹과 다른 새 값                      |
| `AUTH_GOOGLE_ID` | 웹과 같은 값                         | 웹과 같은 값                         |
| `CORS_ORIGINS`   | 로컬 웹·QA 브랜치의 Vercel 고정 별칭 | `https://plan-for-myself.vercel.app` |

- 표의 변수는 설정 파일에 `preserve()`로만 있어 대시보드에서 넣는다. 서버가 새로 요구하는 변수는 staging은 `railway up` 전에, production은 머지 전에 넣고 Deploy까지 한다(값이 없으면 새 배포가 실패하고 이전 배포가 계속 돈다)
- `POSTGRES_URL`은 pooled가 아닌 직접 연결 주소에 `options=-c%20statement_timeout%3D5s` 쿼리 파라미터를 붙여, DB가 5초 넘게 도는 쿼리를 스스로 취소하게 한다. pooled 주소는 이 옵션을 받지 않아 접속이 거부된다
- `AUTH_SECRET`은 이 서버가 앱 토큰을 서명·검증하는 키로, 웹과 다른 32바이트 이상 값이다
- `CORS_ORIGINS`는 쉼표로 구분한 출처 목록이고, 각 출처는 브라우저가 보내는 `Origin` 헤더와 글자까지 같아야 한다. 끝 슬래시·경로·대문자·기본 포트 표기가 있으면 서버가 뜨지 않는다. staging의 로컬 웹 출처는 `http://localhost:3000`이다
- 서비스 변수는 설정 파일이 모두 정한다. 설정 파일에 없는 변수는 apply 때 지워지므로(plan에 `Delete variable`로 나온다), 서버가 새 변수를 요구하면 설정 파일에 값이나 `preserve()`로 먼저 더한다. 그 브랜치에서 apply한 뒤 대시보드에 값을 넣는다(master에서 apply하면 넣은 값이 지워진다)
- `PORT`는 Railway가 넣고, `NODE_ENV=production`은 Dockerfile이 정한다
- `SENTRY_ENABLED=true`인데 `SENTRY_DSN`·`SENTRY_ENVIRONMENT`가 없으면 서버가 뜨지 않는다

### 설정 파일 적용

`railway config plan`으로 바뀔 것을 보고 `railway config apply`로 적용한다. Windows Git Bash에서는 npm 래퍼(`railway`)로 부르면 설정 파일이 CLI 버전을 확인하지 못해 실패하므로, 실행 파일을 직접 부른다.

```bash
"$(npm root -g)/@railway/cli/bin/railway.exe" config plan --environment staging
```

### staging에 브랜치 올리기

PR 없이 로컬 브랜치를 staging에 올린다. 명령을 실행한 폴더가 올라가므로 모노레포 루트에서 실행한다. 작업 트리의 파일이 그대로 올라가므로 `git status`가 깨끗한지 먼저 본다. 처음 한 번은 `railway link`로 이 폴더를 Railway 프로젝트에 연결한다.

```bash
railway up --environment staging --service api
```

### 로컬에서 Sentry 켜기

`instrument.ts`가 `ConfigModule`보다 먼저 실행되어 `.env.local`의 `SENTRY_*`를 읽지 못하므로, 셸 환경변수로 넣는다. 아래는 Git Bash 기준이다.

```bash
yarn workspace api build
SENTRY_ENABLED=true SENTRY_DSN=<DSN> SENTRY_ENVIRONMENT=api-local yarn workspace api start
```

## DB 마이그레이션

테이블 구조는 `src/db/schema.ts`가 원본이고, `yarn workspace api db:generate`가 `src/db/migrations/`에 SQL을 만든다. 테스트·로컬 PGlite에는 서버가 뜰 때 적용된다. Neon(dev·운영)에는 Railway 배포의 pre-deploy 단계가 새 서버를 띄우기 전에 `dist/migrate.mjs`로 적용한다(`.railway/railway.ts`의 `preDeploy`). staging에 올리면 dev에, master에 머지하면 운영에 적용되므로 손으로 돌리지 않는다.

- 마이그레이션이 실패하면 새 배포가 진행되지 않고 이전 배포가 계속 돈다. 실패한 마이그레이션은 트랜잭션째 되돌려져 기록도 남지 않으므로, 고친 커밋을 다시 배포하면 된다
- pre-deploy는 `POSTGRES_URL`로 접속하므로 문장 하나가 그 주소의 `statement_timeout`(5초)을 넘으면 실패한다
- pre-deploy는 이전 배포가 아직 요청을 받는 동안 돈다. 그래서 칸·테이블을 지우거나 이름을 바꾸는 변경은 PR 두 개로 나눈다. 먼저 코드가 그 칸을 쓰지 않게 하는 PR을 머지하고, 그 배포가 끝난 뒤 지우는 마이그레이션 PR을 머지한다. 한 번에 넣으면 이전 배포의 쿼리가 `column does not exist`로 실패한다
- 배포 없이 손으로 적용할 때(로컬 서버를 dev DB에 붙여 확인할 때 등)는 `yarn workspace api db:migrate`를 쓴다. `POSTGRES_URL_NON_POOLING`(pooled 아닌 직접 연결 주소)에 적용한다
- 이미 테이블이 있던 Neon DB는 처음 한 번, 그 테이블을 만든 `0000`·`0001`을 적용된 것으로 기록(베이스라인)한 뒤 돌린다. 기록 없이 돌리면 `0000`부터 다시 적용하려다 이미 있는 테이블에 막혀 실패한다(`db:migrate`는 에러 문구 없이 exit 1로 멈춘다)
- 베이스라인은 아래 SQL로 넣는다. drizzle은 가장 늦은 `created_at` 하나로 적용 여부를 정하므로(hash는 보지 않는다) `0001`의 값은 `meta/_journal.json`의 `when`과 같아야 한다. `0002`부터는 기록하지 않는다. hash는 drizzle이 직접 적용할 때 남기는 값과 같은 SQL 파일의 sha256이다

```sql
CREATE SCHEMA IF NOT EXISTS drizzle;
CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint);
INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES
  ('d2659302ffaec1353d94cc2a3d34039b31a5183d3f39dcb89a608fe9a6e8130f', 1794198826102),
  ('6dd3cf1e5ec1a1b804851e715ddc92fa962504156e649f923471ce5d1fdddeac', 1794287306566);
```

## dev 시드

Neon `dev` branch에 화면 확인용 공부 기록을 넣는다. 한 사용자(google_sub)의 기록을 전부 지우고 시나리오 기록으로 바꾼다. 사용자가 없으면 만든다.

```bash
yarn workspace api db:seed <시나리오> <google_sub>
```

- `POSTGRES_URL_NON_POOLING`(`.env.local`)에 연결하고, 접속한 DB가 Neon `dev` branch가 아니면 쓰기 전에 멈춘다. 로컬 PGlite에는 넣지 못한다
- 시나리오(`streak`·`large`·`fail-compare` 등)는 `src/db/seed/scenario.ts`에 있다. 인자 없이 돌리면 사용법 오류에 시나리오 목록이 나온다
