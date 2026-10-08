/**
 * TP(test-playground)에서 검증한 공통 ESLint 규칙.
 * 각 워크스페이스의 eslint config에서 import해서 사용.
 */

export const baseRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-require-imports': 'error',
  '@typescript-eslint/ban-ts-comment': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/return-await': ['error', 'in-try-catch'],
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/no-misused-promises': ['error', {checksVoidReturn: {attributes: false}}],
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  curly: ['error', 'all'],
  eqeqeq: ['error', 'always'],
  '@typescript-eslint/no-unnecessary-condition': 'error',
  'no-console': ['error', {allow: ['warn', 'error']}],
  '@typescript-eslint/restrict-template-expressions': ['error', {allowNullish: false}],
  '@typescript-eslint/parameter-properties': 'error',
  'id-length': ['error', {min: 2}],
  'id-denylist': ['error', 'Props', 'State'],
  'max-params': ['error', 3],
  '@typescript-eslint/naming-convention': [
    'error',
    {selector: 'default', format: ['camelCase']},
    {selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE']},
    {selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow'},
    {selector: 'parameter', types: ['function'], format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow'},
    {selector: 'function', format: ['camelCase', 'PascalCase']},
    {selector: 'typeLike', format: ['PascalCase']},
    {selector: 'property', format: ['camelCase', 'UPPER_CASE']},
    {selector: 'method', format: ['camelCase']},
    {selector: 'import', format: null},
    {selector: 'variable', modifiers: ['destructured'], format: null},
    {
      selector: [
        'classProperty',
        'objectLiteralProperty',
        'typeProperty',
        'classMethod',
        'objectLiteralMethod',
        'typeMethod',
        'accessor',
        'enumMember',
      ],
      format: null,
      modifiers: ['requiresQuotes'],
    },
  ],
  'no-magic-numbers': [
    'error',
    {
      ignore: [-1, 0, 1, 2],
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true,
      enforceConst: true,
    },
  ],
  'react/function-component-definition': [
    'error',
    {namedComponents: 'function-declaration', unnamedComponents: 'arrow-function'},
  ],
  'react/jsx-sort-props': [
    'error',
    {
      callbacksLast: true,
      shorthandFirst: true,
      reservedFirst: true,
    },
  ],
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: 'react',
          importNames: ['forwardRef'],
          message:
            'forwardRef 사용 금지. React 19부터 함수 컴포넌트가 ref를 일반 prop으로 받습니다. 예: function Input({ref, ...props}: ComponentProps<"input">) { return <input ref={ref} {...props} />; }',
        },
        {
          name: 'react',
          importNames: ['ComponentPropsWithoutRef', 'ComponentPropsWithRef'],
          message:
            'ComponentPropsWithoutRef·ComponentPropsWithRef 사용 금지. ComponentProps를 사용하세요. React 19에서는 함수 컴포넌트·forwardRef·HTML 태그에 대해 ComponentProps가 ref를 포함하도록 동작합니다.',
        },
      ],
      patterns: [
        {
          group: ['**/index', '**/index.ts', '**/index.tsx'],
          message:
            '내부 barrel(index) import 금지. 대상 모듈을 직접 import 하세요. 패키지 entry는 alias(@scope/pkg)로 import.',
        },
      ],
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: "JSXAttribute[name.name='alt'][value.value='']",
      message: '빈 alt 금지. 장식용 이미지라면 eslint-disable + 사유 주석을 남기세요.',
    },
    {
      selector: "JSXAttribute[name.name='alt'] > JSXExpressionContainer > Literal[value='']",
      message: '빈 alt 금지. 장식용 이미지라면 eslint-disable + 사유 주석을 남기세요.',
    },
    {
      selector:
        "JSXAttribute[name.name='alt'] > JSXExpressionContainer > TemplateLiteral[quasis.length=1][quasis.0.value.raw='']",
      message: '빈 alt 금지. 장식용 이미지라면 eslint-disable + 사유 주석을 남기세요.',
    },
    {
      selector: 'TSEnumDeclaration',
      message: 'enum 대신 as const 객체를 사용하세요.',
    },
    {
      selector:
        "JSXAttribute[name.name!='ref'] > JSXExpressionContainer > :matches(ArrowFunctionExpression[body.type='BlockStatement'], FunctionExpression)",
      message:
        'JSX 속성 안에 블록 본문 함수({ } 본문) 금지. return부는 컴포넌트 구조를 한눈에 보는 자리입니다. 컴포넌트 본문에 동작을 드러내는 이름의 함수로 빼고 속성엔 이름만 넘기세요(예: const addTagOnEnter = (event) => {...}; onKeyDown={addTagOnEnter}). 인자를 묶는 식 본문 한 줄(onRemove={() => removeTag(tag)})과 ref 콜백은 허용.',
    },
    {
      selector: 'TSTypeReference > TSQualifiedName[left.name="React"]',
      message: 'React.X 대신 import { X } from "react"를 사용하세요.',
    },
    {
      selector: 'MemberExpression[object.name="React"]',
      message: 'React.X 대신 import { X } from "react"를 사용하세요.',
    },
    {
      selector: 'JSXMemberExpression[object.name="React"]',
      message: 'React.X 대신 import { X } from "react"를 사용하세요.',
    },
    {
      selector: 'CatchClause > Identifier.param[typeAnnotation]',
      message: 'catch 변수의 타입 어노테이션 금지. TS 4.4+에서 catch 변수는 기본 unknown입니다.',
    },
    {
      selector: "ConditionalExpression > CallExpression[callee.name='clsx']",
      message: 'clsx를 삼항으로 감싸지 마세요. 조건은 clsx(a, cond && b) 인자로 표현합니다.',
    },
    {
      selector:
        "Property[key.name='mutationFn'] > ArrowFunctionExpression[body.type='CallExpression'][body.callee.type='Identifier']",
      message:
        'mutationFn에 (args) => api(args) 인라인 래핑 금지. API 함수 reference만 박고 인자는 mutateAsync로 전달하세요. 예: mutationFn: postBoardApi',
    },
    {
      selector: "Property[key.name='mutationFn'] > ArrowFunctionExpression[body.type='BlockStatement']",
      message:
        'mutationFn 안에 가드·조립 로직(블록 본문) 금지. 검증은 호출부 try 안에서 throw하고, mutationFn은 API 함수 reference만 유지하세요.',
    },
    {
      selector: "Property[key.name='mutationFn'] > FunctionExpression",
      message:
        'mutationFn에 function 표현식 금지. API 함수 reference만 박고 인자는 mutateAsync로 전달하세요. 예: mutationFn: postBoardApi',
    },
    {
      selector: "MemberExpression[object.name='module'][property.name='exports']",
      message: 'CJS module.exports 금지. ESM export로 바꾸세요. (의도적 CJS는 .cjs 확장자로 분리)',
    },
    {
      selector: "AssignmentExpression[left.object.name='exports']",
      message: 'CJS exports.X 금지. ESM named export로 바꾸세요. (의도적 CJS는 .cjs 확장자로 분리)',
    },
    {
      selector:
        "CallExpression[callee.object.name='vi'][callee.property.name=/^(mock|doMock)$/][arguments.0.type='Literal']",
      message:
        "vi.mock/doMock의 첫 인자로 문자열 경로 금지. import('./x') 형태로 넘기세요. 그래야 factory 반환값이 실제 모듈 타입과 대조되고(잘못된 모킹 차단), IDE 파일 이동 시 경로가 자동 갱신됩니다.",
    },
    {
      selector:
        "CallExpression[callee.property.name='each']:matches([callee.object.name=/^(describe|it|test)$/], [callee.object.object.name=/^(describe|it|test)$/])",
      message:
        'each 금지 — for를 쓰세요(it.for/test.for/describe.for). each는 배열 인자를 spread하는 Jest 호환용 레거시입니다(it.for/test.for는 Test Context도 제공, Vitest 공식 "Prefer test.for in new code"). Jest 마이그레이션을 안 하므로 신규 코드는 for. 객체 케이스는 .each→.for로 충분합니다.',
    },
    {
      selector:
        "TaggedTemplateExpression[tag.property.name='each']:matches([tag.object.name=/^(describe|it|test)$/], [tag.object.object.name=/^(describe|it|test)$/])",
      message:
        'each 금지 — for를 쓰세요(it.for/test.for/describe.for). each는 배열 인자를 spread하는 Jest 호환용 레거시입니다(it.for/test.for는 Test Context도 제공, Vitest 공식 "Prefer test.for in new code"). Jest 마이그레이션을 안 하므로 신규 코드는 for. 객체 케이스는 .each→.for로 충분합니다.',
    },
    {
      selector: "CallExpression[callee.property.name='resetHandlers'][arguments.length>0]",
      message:
        'Do not pass handlers to resetHandlers() — it wipes initial handlers and harms predictability. Use resetHandlers() then use(...) instead.',
    },
    {
      selector: "Property[key.name='waitUntil'][value.value='networkidle']",
      message:
        'Playwright의 networkidle 금지 — 공식이 DISCOURAGED로 표시하며 "Don\'t use this method for testing, rely on web assertions to assess readiness instead"라고 명시합니다. 로드 상태를 기다리지 말고 expect(...).toBeVisible() 등 자동 재시도하는 검사문에 맡기세요.',
    },
    {
      selector: "CallExpression[callee.property.name='waitForLoadState'][arguments.0.value='networkidle']",
      message:
        'Playwright의 networkidle 금지 — 공식이 DISCOURAGED로 표시하며 "Don\'t use this method for testing, rely on web assertions to assess readiness instead"라고 명시합니다. 로드 상태를 기다리지 말고 expect(...).toBeVisible() 등 자동 재시도하는 검사문에 맡기세요.',
    },
    {
      selector:
        "CallExpression[callee.property.name='catch'] > ArrowFunctionExpression:matches([body.type='Literal'][body.value=null], [body.type='Identifier'][body.name='undefined'])",
      message:
        '에러를 null·undefined로 뭉개는 catch 금지. 404·500·네트워크 오류가 한 결과로 합쳐져 장애가 "없음"으로 위장됩니다. 실패 종류를 구분해 처리하세요(예: 404만 null 반환, 나머지는 throw 전파). 이미 throw 중에 에러 본문을 파싱하는 등 정당한 경우만 eslint-disable + 사유 주석.',
    },
    {
      selector: 'CatchClause[body.body.length=0]',
      message:
        '빈 catch 금지. 에러를 통째로 삼키면 실패가 흔적 없이 사라집니다. 처리하거나 재던지세요. 무시가 의도라면 eslint-disable + 사유 주석.',
    },
  ],
};

/**
 * MSW resolver 스코프 룰(목/핸들러·테스트 파일에만 적용, `mockFilesConfig`·`testFilesConfig`에서 spread).
 * 앱 소스에는 넣지 않는다 — `http.get(url, cb)`는 node:http에서 정당하게 쓰이므로 전역으로 잡으면 오탐.
 */
const mswResolverRules = [
  {
    selector:
      "CallExpression[callee.object.name='http'][callee.property.name=/^(get|post|put|delete|patch|all)$/][arguments.0.value=/[?]/]",
    message:
      'MSW predicate(http.get 등 첫 인자)에 쿼리스트링(?) 금지. predicate는 경로만으로 매칭하고 MSW가 쿼리를 조용히 제거하므로(런타임 경고 없음), 쿼리 값은 resolver에서 new URL(request.url).searchParams.get("page")로 읽으세요.',
  },
  {
    selector:
      "CallExpression[callee.object.name='http'][callee.property.name=/^(get|post|put|delete|patch|all)$/] > TemplateLiteral.arguments TemplateElement[value.raw=/[?]/]",
    message:
      'MSW predicate(http.get 등 첫 인자)에 쿼리스트링(?) 금지. predicate는 경로만으로 매칭하고 MSW가 쿼리를 조용히 제거하므로(런타임 경고 없음), 쿼리 값은 resolver에서 new URL(request.url).searchParams.get("page")로 읽으세요.',
  },
];

/**
 * 테스트 파일 전용 override(각 워크스페이스 config 배열에 추가). 테스트 JSX의 `aria-*` 작성 금지 —
 * a11y가 현재 우선순위가 아니라서. `getByRole`는 허용, base 기존 `no-restricted-syntax` 항목은 보존.
 * `no-floating-promises`는 전역 off를 여기서만 되살린다(await 누락 차단).
 */
export const testFilesConfig = {
  files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
    'no-restricted-syntax': [
      'error',
      ...baseRules['no-restricted-syntax'].slice(1),
      {
        selector: 'JSXAttribute[name.name=/^aria-/]',
        message:
          '테스트 JSX에 aria-* 속성을 직접 쓰지 않습니다. getByRole로 쿼리하거나, 불가피하면 eslint-disable + 사유 주석.',
      },
      {
        selector:
          "CallExpression[callee.name='expect'] MemberExpression[object.property.name='mock'][property.name=/^(calls|lastCall|results|settledResults|instances|invocationCallOrder)$/]",
        message:
          'expect() 안에서 목 내부(mock.calls 등)를 파헤치지 않습니다. 인자 검증은 toHaveBeenCalledWith + expect.objectContaining(한 겹)으로, DOM 이벤트면 클릭한 엘리먼트를 변수로 잡아 대조하세요. 꼭 꺼내야 하면 이름 붙인 헬퍼 함수로 분리합니다.',
      },
      ...mswResolverRules,
    ],
  },
};

/**
 * MSW 목/핸들러 파일 전용 override(각 워크스페이스 config 배열에 추가). resolver 스코프 룰(predicate 쿼리 금지)을
 * 목·핸들러 파일(`src/mocks/**`, `*.mock.*`)에 적용한다. 테스트 파일은 `testFilesConfig`가 담당하므로
 * `ignores`로 겹침(no-restricted-syntax last-wins)을 막는다.
 */
export const mockFilesConfig = {
  files: ['**/mocks/**/*.{ts,tsx}', '**/*.mock.{ts,tsx}'],
  ignores: ['**/*.test.{ts,tsx}'],
  rules: {
    'no-restricted-syntax': ['error', ...baseRules['no-restricted-syntax'], ...mswResolverRules],
  },
};
