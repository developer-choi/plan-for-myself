## 웹과 앱이 로직을 한 벌로 쓰기

### 문제

웹과 앱은 화면만 다를 뿐, 기록을 저장하고 에러를 처리하는 로직은 대부분 같습니다.

이 로직을 두 벌로 두면 웹을 고칠 때마다 앱도 따로 고쳐야 하고, 한쪽을 빠뜨리면 두 화면이 다르게 동작합니다.

그렇다면, 웹과 앱이 같은 로직을 어떻게 한 벌로 쓸 수 있을까요?

### 해결

그래서 앱을 만들기 전에 레포를 [모노레포로 옮기고](https://github.com/developer-choi/plan-for-myself/pull/35), 웹과 앱이 [같은 공통 패키지를 쓰게 했습니다](https://github.com/developer-choi/plan-for-myself/pull/36).

공통 패키지에는 타입, 입력 한도와 문구, 날짜 계산, API 함수, 훅 같은 것들이 들어 있고, 그중 하나가 **기록 폼 로직**입니다.

기록을 저장·삭제하고, 서버가 거절하면 문구를 띄우고, 성공하면 달력과 통계를 새로 받는 로직을 [공통 패키지의 훅 하나로 두었습니다]([PR: 기록 폼 로직을 공통 패키지로]). 웹과 앱은 같은 훅을 호출하고, 화면만 각자 그립니다.

```tsx
// 웹 (Next.js)
const {methods, form} = useRecordForm({
  target: {date, month, record},
  onClose,
  dependencies: {
    api: studyRecordApi, // 쿠키로 인증하는 API 클라이언트
    reportUnexpectedError: (error) => {
      console.error(error);
      captureException(error); // @sentry/nextjs
    },
  },
});

return <Dialog.Root open={isOpen} onClose={onClose}>{/* … */}</Dialog.Root>;
```

```tsx
// 앱 (React Native)
const {methods, form} = useRecordForm({
  target: {date, month, record},
  onClose,
  dependencies: {
    api: studyRecordApi, // 토큰으로 인증하는 API 클라이언트
    reportUnexpectedError: captureException, // @sentry/react-native
  },
});

return <Modal visible={isOpen} onRequestClose={onClose}>{/* … */}</Modal>;
```

API 클라이언트와 Sentry SDK처럼 플랫폼마다 다른 것은, 공통 패키지가 직접 가져오지 않고 인자로 받습니다.

화면은 같이 쓰지 않았습니다. 웹이 쓰는 디자인 시스템이 DOM과 Sass로 만들어져 있어 React Native에서는 그릴 수 없기 때문입니다.

### 단점

로직은 한 벌이어도 화면은 여전히 두 벌입니다.

예를 들어 서버가 거절했을 때 띄우는 문구를 보여 주는 자리만 해도 웹은 `Callout`, 앱은 `Text`로 각자 그려서, 화면을 바꾸면 두 군데를 고쳐야 합니다.

하지만, 로직이 두 벌이라 웹과 앱이 다르게 동작하는 비용보다는 작다고 판단했습니다.

## 정적 분석 도입

### 문제

AI가 코드를 많이 쓸수록 제가 리뷰할 코드도 그만큼 늘어납니다.

그런데, 이런 실수까지 제가 매번 눈으로 잡아야 할까요?

```typescript
ALLOW_ACCOUNT_LIST.includes(params.user.email as any); // 타입 검사를 끔        → no-explicit-any
const data = JSON.parse(response);                     // any가 조용히 퍼짐      → no-unsafe-assignment
const count = input || 10;                             // 값이 없을 때만 10을 쓰려 했는데, 0이어도 10이 됨 → prefer-nullish-coalescing
const msg = `user: ${user.name}`;                      // name이 없으면 "user: undefined" → restrict-template-expressions
```

### 해결

이런 실수는 [커밋 시점에 자동으로 막고](https://github.com/developer-choi/plan-for-myself/pull/39), 웹·앱·공통 패키지가 같은 규칙을 쓰게 했습니다.

### 단점

규칙이 많아지면 정상 코드까지 막습니다.

예를 들어 소개 페이지 그림에 쓰는 예시 데이터는 날짜·공부 시간 같은 숫자 자체가 내용이라, 숫자를 그대로 쓰지 못하게 막는 규칙을 파일 전체에서 꺼야 했습니다.

```typescript
/* eslint-disable no-magic-numbers -- 소개 페이지 그림에만 쓰는 고정 예시 데이터라 숫자를 그대로 적는다 */
const MISSING_DAYS = [9, 17];                        // 기록을 안 남긴 날
const STUDY_MINUTES = [210, 95, 120, 150, 185, 240]; // 날마다 돌아가며 쓰는 공부 시간(분)
```

예외가 예시 데이터 파일 2개뿐이라 이 규칙은 유지했습니다.

그래서 규칙마다 아래 둘을 비교해서 판단하고 있습니다.

- **노이즈**: 규칙을 끄는 예외 주석이 늘어나는 것
- **이득**: 그 규칙 덕분에 제가 리뷰하지 않아도 되는 코드가 늘어나는 것

폭·높이까지 디자인 토큰만 쓰게 막았을 때는, 예외 주석 4개가 모두 "토큰이 없다"는 사유여서 [폭·높이만 규칙에서 뺐습니다](https://github.com/developer-choi/plan-for-myself/commit/5d2a189fbef01c5ed7ad58f7e5f998c7be753e0a). 색·여백·글자 크기는 지금도 막습니다.

반대로 기록 폼에서 17줄짜리 함수가 JSX 속성 안에 들어간 것을 리뷰에서 놓쳤을 때는, [같은 실수를 규칙으로 막았습니다](https://github.com/developer-choi/plan-for-myself/commit/d1155c4d304d7eb244e1000f7289946d1e6759f9).

규칙에서 뺀 것은 더 이상 자동으로 막지 못하는 단점이 남아 있습니다.

하지만, 예외 주석을 매번 달고 읽는 비용보다는 작다고 판단했습니다.

## 웹뷰 없이 앱을 배포하고 운영하기

### 문제

웹이 이미 있어서, 비용만 보면 앱은 웹을 웹뷰로 띄우는 것이 합리적이었습니다.

- 웹을 배포하면 앱에도 바로 반영되어, 스토어 심사를 기다리지 않습니다.
- 사용자 폰에 옛 버전 화면·로직이 남지 않습니다.
- 앱에서 난 에러도 웹의 에러 수집에 그대로 쌓입니다.

그래도 React Native를 익히는 것이 목적이어서, 화면을 React Native로 다시 만들었습니다.

게다가 웹뷰로 만들었어도, Google이 앱 안 웹뷰에서의 Google 로그인을 막기 때문에 로그인은 네이티브로 구현해야 했습니다.

그렇다면, 웹뷰라면 따로 하지 않아도 되던 일을 React Native 앱에서는 어떻게 메울 수 있을까요?

### 해결

- **심사 없이 고치기** — 네이티브 코드가 바뀌지 않은 수정은 [EAS Update로 스토어 심사 없이 내보내고]([PR: EAS Update 설정과 되돌림]), 잘못 내보낸 업데이트는 이전 업데이트로 되돌립니다.
- **옛 버전 앱과 함께 쓰기** — 출시 뒤에는 API를 지우거나 뜻을 바꾸지 않고 더하기만 합니다(예: [웹의 쿠키 인증은 두고 앱의 토큰 인증을 더함]([PR: 앱용 로그인 API])). 통계 지표는 서버가 계산해, 앱 버전이 달라도 같은 값을 받습니다.
- **앱에서 난 에러 보기** — 앱의 에러도 [Sentry로 모으고]([PR: 앱 에러 보고]), 어느 앱 버전·어느 업데이트에서 난 에러인지 나눠 봐서, EAS Update로 내보낸 수정이 낸 에러를 가려냅니다.

### 단점

네이티브 코드·앱 권한·Expo SDK를 바꾸는 수정은 여전히 새 빌드와 스토어 심사를 거쳐야 합니다.

또 사용자가 스토어에서 새 버전을 받지 않으면 옛 버전 앱이 남고, 그동안 API를 더하기만 하는 제약도 지켜야 합니다.

하지만, 웹뷰를 골라 React Native를 익힐 기회를 잃는 비용보다는 작다고 판단했습니다.

## AI 코드리뷰 도입

### 문제

AI가 작성한 코드의 실수를 정적 분석으로 모두 잡을 수는 없습니다.

나머지를 전부 사람이 리뷰하려면 시간이 오래 걸려서, AI에게 맡기려고 했습니다.

하지만, 엉뚱한 리뷰만 내놓으면 **오히려 사람에게 노이즈**가 될 수 있습니다.

그렇다면, AI는 무엇을 기준으로 리뷰해야 할까요?

### 해결

"이 기능은 이렇게 구현하는 것이 가장 좋다"는 [베스트 프랙티스](https://github.com/developer-choi/monorepo-playground/tree/master/docs/best-practices)를 예시 코드와 함께 쌓아 두고, 이것을 리뷰 기준으로 쓰게 했습니다.

AI 리뷰어는 바뀐 코드를 보고 필요한 베스트 프랙티스만 골라 읽고, 규칙 문장뿐 아니라 예시 코드와 모양이 같은지도 대조하게 했습니다(→ [AI 리뷰 지시문: 예시 코드 대조](https://github.com/developer-choi/ai-contexts/blob/20bfdc8f8960ff98030a6b05ae32bc3e335322ba/deploy/skills/code-review/SKILL.md#L88-L104)).

### 단점

AI가 많은 것을 판단하게 하려면, 판단 기준도 많이 줘야 합니다.

예를 들어, 통계 페이지 하나를 통째로 리뷰한다고 하면 이만큼 읽어야 합니다.

1. 베스트 프랙티스: 통계 페이지에 있는 주제(데이터 조회, 화면 렌더링, 컴포넌트 UI)별 원칙, 예제 코드 등
2. Next.js·React 성능 권고: [vercel-react-best-practices](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) (Vercel 공식 스킬, 규칙 70개)
3. 웹 인터페이스·접근성 가이드라인: [web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) (Vercel 공식 스킬)
4. 컴포넌트 설계 패턴: [vercel-composition-patterns](https://github.com/vercel-labs/agent-skills/blob/main/skills/composition-patterns/SKILL.md) (Vercel 공식 스킬)

한 AI가 이걸 다 읽으면 컨텍스트가 비대해지는 문제가 있습니다.

그래서 이런 경우 AI마다 읽을 것과 관점을 나눠 맡겼습니다(→ [AI 리뷰 지시문: 리뷰어 나누기](https://github.com/developer-choi/ai-contexts/blob/20bfdc8f8960ff98030a6b05ae32bc3e335322ba/deploy/skills/code-review/SKILL.md#L128-L136)).

| 리뷰어 | 읽는 것 | 보는 것 |
|---|---|---|
| 코딩 규칙 리뷰어 (영역마다 한 명) | 제 코딩 규칙과 1 중 한 영역 | 제 규칙과 예제 코드 모양에 맞는가 |
| 외부 스킬 리뷰어 (스킬마다 한 명) | 2·3·4 중 하나 | 그 스킬의 권고에 어긋나는가 |
| 자유 리뷰어 | 코드 전체 | 규칙 밖의 깊은 문제가 있는가 |

모델도 리뷰어가 보는 것에 맞춰 나눴습니다. 규칙과 대조하는 코딩 규칙 리뷰어는 **Sonnet**으로, 규칙 밖의 깊은 문제를 찾는 자유 리뷰어는 **Opus**로 띄웠습니다.

리뷰어들은 동시에 띄우고, 결과는 한곳에 모아 겹치는 지적을 걸러 냈습니다.

리뷰어를 나눈 만큼 AI 사용량은 늘어납니다.

하지만, 제가 모든 코드를 직접 리뷰하는 비용보다는 작다고 판단했습니다.

## 마지막은 항상 사람이 리뷰

정적 분석과 AI 코드리뷰는 둘 다, **제가 보기 전에 먼저 잡는다**는 데 가치가 있습니다.

그래서 코드를 합치기 전에는 언제나 제가 직접 화면을 열어 결과물을 다 봤습니다.

## References: [Upcoming security changes to Google's OAuth 2.0 authorization endpoint in embedded webviews](https://developers.googleblog.com/2021/06/upcoming-security-changes-to-googles-oauth-2.0-authorization-endpoint.html)

> All embedded webviews will be blocked starting on September 30, 2021.

## References: [Expo Update](https://docs.expo.dev/eas-update/faq/)

> When to use Expo Update
>
> - ✓ Fix a bug or crash in JavaScript code and deploy updates in minutes
> - ✓ Update copy, translations, UI styling, or screen layouts
> - ✗ Change to native code or native dependencies
> - ✗ Change to app permissions (camera, location, and others)
> - ✗ Update the Expo SDK version
>
> For scenarios marked with ✗, use Expo Build to create and submit a new app binary.
