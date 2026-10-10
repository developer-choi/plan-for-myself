export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'subject-korean': ({subject}) => {
          const hasKorean = /[\uAC00-\uD7AF]/.test(subject);
          return [hasKorean, 'subject에 한글이 없습니다 — 영어 전용 커밋은 금지입니다 (한글 필수)'];
        },
      },
    },
  ],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // 공통
        'setting',
        'utils',
        'ui',
        'auth',
        'intro',
        'docs',
        // 기능(도메인)
        'study-record',
        'study-record-stats',
        'demo',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [0],
    'subject-korean': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
  },
};
