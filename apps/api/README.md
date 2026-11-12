# apps/api

웹·앱이 함께 사용하는 NestJS API 서버.

## 배포 (Railway)

Railway 프로젝트 하나에 `staging`·`production` 환경을 두고, 환경마다 같은 설정의 `api` 서비스를 둔다. 서비스 설정(헬스 체크·리전·변수)은 레포 루트의 `.railway/railway.ts`(Railway Infrastructure as Code)가 정한다.

### 설정 파일 밖에서 넣는 것

| 항목           | staging                  | production               |
| -------------- | ------------------------ | ------------------------ |
| 소스           | `railway up` 업로드      | GitHub `master`          |
| `POSTGRES_URL` | Neon `dev` 브랜치        | Neon `main` 브랜치       |
| `SENTRY_DSN`   | 웹과 같은 프로젝트의 DSN | 웹과 같은 프로젝트의 DSN |

- 표의 변수는 설정 파일에 `preserve()`로만 있어 대시보드에서 넣는다. 서버가 새로 요구하는 변수는 staging은 `railway up` 전에, production은 머지 전에 넣고 Deploy까지 한다(값이 없으면 새 배포가 실패하고 이전 배포가 계속 돈다)
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
