import {INTRO_MONTHLY, INTRO_TREND} from '@plan-for-myself/shared/intro';
import {isReduced} from '@plan-for-myself/shared/study-record-stats';
import {describe, expect, it} from 'vitest';

describe('소개 고정 예시 데이터', () => {
  describe('General cases', () => {
    INTRO_MONTHLY.failureTags
      .filter((tag) => tag.previousCount > 0)
      .forEach(({tag, count, previousCount, status}) => {
        const reduced = isReduced(count, previousCount);

        it(`${tag} 태그가 지난달 ${previousCount}번에서 이번 달 ${count}번이면 ${getStatusLabel(reduced)}으로 표시해야 한다`, () => {
          expect(status).toBe(reduced ? 'reduced' : 'repeated');
        });
      });

    INTRO_MONTHLY.failureTags
      .filter((tag) => tag.previousCount === 0)
      .forEach(({tag, status}) => {
        it(`지난달에 없던 ${tag} 태그는 새로 생김으로 표시해야 한다`, () => {
          expect(status).toBe('appeared');
        });
      });

    INTRO_TREND.forEach(({month, count, previousCount, status}) => {
      const reduced = isReduced(count, previousCount);

      it(`${month} 추이가 지난달 ${previousCount}번에서 이번 달 ${count}번이면 ${getStatusLabel(reduced)}으로 표시해야 한다`, () => {
        expect(status).toBe(reduced ? 'reduced' : 'repeated');
      });
    });
  });
});

function getStatusLabel(reduced: boolean) {
  return reduced ? '줄어듦' : '반복';
}
