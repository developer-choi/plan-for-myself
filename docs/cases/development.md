## 만들어 둔 베스트 프랙티스 기반으로 짧게 지시하기

### 문제

AI는 **풍부하게 설명해야** 의도대로 구현해 줍니다.

그 설명을 매번 반복하는 데 사람의 시간이 듭니다.

### 해결

1. "이 기능은 이렇게 구현하는 것이 가장 좋다"는 [베스트 프랙티스](https://blog-sepia-pi-37.vercel.app/posts/infinite-scroll-step3)를 쌓아 두고,
2. 그것을 [목차로 정리](https://github.com/developer-choi/monorepo-playground/tree/master/docs/best-practices)해, AI가 폴더명과 파일명만 보고 필요한 것을 찾아가게 했습니다.

### 결과

1. 구현하는 시간을 아껴, 베스트 프랙티스를 더 만들 수 있게 됐습니다.
2. 새로 만든 것도 같은 방식으로 정리해, 비슷한 것을 만들 때 다시 참고할 수 있게 됐습니다.

결과적으로, 구현은 종류별로 **한 번만** 하는 것을 목표로 하고 있습니다.

### 단점

이런 식으로 문서를 계속 쌓아 나가면, 결국 AI가 읽어야 하는 컨텍스트 양이 많아지는 문제가 있습니다.

그래서 이것을 완화하기 위해, 문서를 **폴더 구조로 나눠** AI가 전부가 아니라 필요한 것만 읽게 했습니다.

```
coding-standards/
├── rules/                  
│   └── personal/           
│       └── typescript/
│           └── basic.md
└── principles/             
    └── personal/
        └── quality/
            └── co-location.md

best-practices/             
├── testing.md
└── form.md                 
```

완화가 가능하다 해도 단점이 남아 있긴 합니다.

하지만, AI가 문서를 더 읽는 부담이 **매번 AI에게 설명**하는 시간이나 **설명을 빠뜨려** 다시 작업하는 시간보다는 작다고 판단했습니다.

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

## 테스트 도입

### 문제

AI가 작성한 모든 코드를 정적 분석만으로는 다 검증할 수 없습니다.

그렇다면, 무엇을 어떻게 테스트해야 할까요?

### 해결

> 테스트는 사용자가 이용할 때 문제없다는 **확신**을 위해 씁니다

그래서 사용자가 보지 않는 내부 상태가 아니라, **사용자가 보는 행동**을 테스트했습니다. ([왜 테스트를 쓰는가](https://blog-sepia-pi-37.vercel.app/posts/why-to-test), [무엇을 테스트하는가](https://blog-sepia-pi-37.vercel.app/posts/how-to-test))

```tsx
// 사용자가 보지 않는 내부 상태를 확인하는 테스트
expect(result.current.isOpen).toBe(true);

// 사용자가 보는 행동을 확인하는 테스트
await user.click(screen.getByRole('button', {name: '기록하기'}));
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

내부 상태가 맞아도 화면에 창이 안 뜨면 사용자에게는 고장입니다. 위 테스트는 통과하고, 아래 테스트는 실패해서 알려 줍니다.

정적 분석이 이미 잡는 것은 테스트로 다시 쓰지 않았습니다.

### 결과

기능을 리팩토링했을 때 AI·사람 코드리뷰보다 저렴한 비용으로 검증이 가능했습니다.

## AI 코드리뷰 도입

### 문제

AI가 작성한 모든 코드를 정적 분석·테스트로 잡을 수는 없습니다.

나머지를 전부 사람이 리뷰하려면 시간이 오래 걸려서, AI에게 맡기려고 했습니다.

하지만, 엉뚱한 리뷰만 내놓으면 **오히려 사람에게 노이즈**가 될 수 있습니다.

그렇다면, AI는 무엇을 기준으로 리뷰해야 할까요?

### 해결

처음에 만든 베스트 프랙티스를 리뷰 기준으로 한 번 더 사용했습니다.

베스트 프랙티스에 없는 부분은 **공식 문서**를 찾아 대조하게 했습니다.

### 단점

AI가 많은 것을 판단하게 하려면, 판단 기준도 많이 줘야 합니다.

예를 들어, 통계 페이지 하나를 통째로 리뷰한다고 하면 이만큼 읽어야 합니다.

1. 베스트 프랙티스: 통계 페이지에 있는 주제(데이터 조회, 화면 렌더링, 컴포넌트 UI)별 원칙, 예제 코드 등
2. Next.js·React 성능 권고: [vercel-react-best-practices](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) (Vercel 공식 스킬, 규칙 70개)
3. 웹 인터페이스·접근성 가이드라인: [web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) (Vercel 공식 스킬)
4. 컴포넌트 설계 패턴: [vercel-composition-patterns](https://github.com/vercel-labs/agent-skills/blob/main/skills/composition-patterns/SKILL.md) (Vercel 공식 스킬)

한 AI가 이걸 다 읽으면 컨텍스트가 비대해지는 문제가 있습니다.

그래서 이런 경우 AI마다 읽을 것과 관점을 나눠 맡겼습니다.

| 리뷰어 | 읽는 것 | 보는 것 |
|---|---|---|
| 코딩 규칙 리뷰어 | 1 | 제 규칙과 예제 코드 모양에 맞는가 |
| 외부 스킬 리뷰어 (스킬마다 한 명) | 2·3·4 중 하나 | 그 스킬의 권고에 어긋나는가 |
| 자유 리뷰어 | 코드 전체 | 규칙 밖의 깊은 문제가 있는가 |

통계 페이지 작업에서는 코딩 규칙 리뷰어 3명, 외부 스킬 리뷰어 1명, 자유 리뷰어 1명을 동시에 띄웠습니다.

모델도 리뷰어가 보는 것에 맞춰 나눴습니다. 규칙과 대조하는 코딩 규칙 리뷰어는 **Sonnet**으로, 규칙 밖의 깊은 문제를 찾는 자유 리뷰어는 **Opus**로 띄웠습니다.

완화가 가능하다 해도 단점은 남아 있습니다.

하지만, 제가 전부 리뷰하는 시간보다는 저렴하다고 판단했습니다.

## 마지막은 항상 사람이 리뷰

위의 정적 분석·테스트·AI 코드리뷰는 모두, **제가 보기 전에 먼저 잡는다**는 데 가치가 있습니다.

그래서 모든 결과물은 코드를 합치기 전에 제가 직접 화면을 열어 다 봤습니다.