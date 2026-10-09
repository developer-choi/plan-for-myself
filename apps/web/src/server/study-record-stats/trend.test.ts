import {describe, expect, it} from 'vitest';
import {addMonths} from './date';
import {countTagsByMonth} from './tag-count';
import {createTestRecord} from './test-record';
import {listTrend} from './trend';

describe('listTrend()', () => {
  describe('General cases', () => {
    it('처음 나온 달부터 조회하는 달까지 달 순서대로 반환해야 한다', () => {
      const counts = countTagsByMonth(
        createMonthlyRecords('야식', {'2026-04': 1, '2026-05': 1, '2026-07': 1, '2026-08': 1, [QUERY_MONTH]: 1}),
      );

      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend.map(({month}) => month)).toEqual(RECENT_SIX_MONTHS);
    });

    it('처음 나온 뒤 0번인 달도 반환해야 한다', () => {
      const counts = countTagsByMonth(
        createMonthlyRecords('야식', {'2026-04': 1, '2026-05': 1, '2026-07': 1, '2026-08': 1, [QUERY_MONTH]: 1}),
      );

      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend.map(({count}) => count)).toEqual([1, 1, 0, 1, 1, 1]);
    });

    it('달마다 지난달 횟수를 함께 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-07': 2, '2026-08': 4, [QUERY_MONTH]: 1}));

      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend).toEqual([
        {month: '2026-07', count: 2, previousCount: 0, status: 'repeated'},
        {month: '2026-08', count: 4, previousCount: 2, status: 'repeated'},
        {month: QUERY_MONTH, count: 1, previousCount: 4, status: 'reduced'},
      ]);
    });

    it('지난달 횟수보다 적은 달은 줄어든 달로 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-08': 3, [QUERY_MONTH]: 1}));
      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend.at(-1)).toMatchObject({status: 'reduced'});
    });

    it('지난달 횟수보다 많은 달은 반복하는 달로 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-08': 1, [QUERY_MONTH]: 3}));
      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend.at(-1)).toMatchObject({status: 'repeated'});
    });

    describe('최근 6개월보다 오래 나온 태그', () => {
      it('최근 6개월만 반환해야 한다', () => {
        const counts = countTagsByMonth(createEveryMonthRecords('늦잠', '2026-01', {'2026-03': 5}));
        const trend = listTrend(counts, QUERY_MONTH, '늦잠');

        expect(trend.map(({month}) => month)).toEqual(RECENT_SIX_MONTHS);
      });

      it('최근 6개월보다 앞 달의 횟수를 맨 앞 달의 지난달 횟수로 반환해야 한다', () => {
        const counts = countTagsByMonth(createEveryMonthRecords('늦잠', '2026-01', {'2026-03': 5}));
        const [first] = listTrend(counts, QUERY_MONTH, '늦잠');

        expect(first).toMatchObject({previousCount: 5});
      });
    });
  });

  describe('Boundary cases', () => {
    it('지난달 횟수와 같은 달은 반복하는 달로 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-08': 2, [QUERY_MONTH]: 2}));
      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend.at(-1)).toMatchObject({status: 'repeated'});
    });

    it('지난달 횟수가 0인 달은 반복하는 달로 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {[QUERY_MONTH]: 1}));
      const trend = listTrend(counts, QUERY_MONTH, '야식');

      expect(trend.at(-1)).toMatchObject({status: 'repeated'});
    });

    it('조회하는 달에만 나온 태그는 그 달 하나만 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('두통', {[QUERY_MONTH]: 1}));

      expect(listTrend(counts, QUERY_MONTH, '두통')).toEqual([
        {month: QUERY_MONTH, count: 1, previousCount: 0, status: 'repeated'},
      ]);
    });

    const firstMonthCases: {
      name: string;
      firstMonth: string;
      overrides: Record<string, number>;
      previousCount: number;
    }[] = [
      {name: '최근 6개월의 첫 달', firstMonth: '2026-04', overrides: {}, previousCount: 0},
      {name: '최근 6개월보다 한 달 앞', firstMonth: '2026-03', overrides: {'2026-03': 2}, previousCount: 2},
    ];

    firstMonthCases.forEach(({name, firstMonth, overrides, previousCount}) => {
      describe(`${name}에 처음 나온 태그`, () => {
        it('최근 6개월을 반환해야 한다', () => {
          const counts = countTagsByMonth(createEveryMonthRecords('야식', firstMonth, overrides));
          const trend = listTrend(counts, QUERY_MONTH, '야식');

          expect(trend.map(({month}) => month)).toEqual(RECENT_SIX_MONTHS);
        });

        it(`맨 앞 달의 지난달 횟수를 ${previousCount}번으로 반환해야 한다`, () => {
          const counts = countTagsByMonth(createEveryMonthRecords('야식', firstMonth, overrides));
          const [first] = listTrend(counts, QUERY_MONTH, '야식');

          expect(first).toMatchObject({previousCount});
        });
      });
    });

    describe('해가 바뀌는 범위', () => {
      it('연도를 넘어 달 순서대로 반환해야 한다', () => {
        const counts = countTagsByMonth(
          createMonthlyRecords('야식', {'2025-11': 1, '2025-12': 3, '2026-01': 2, '2026-02': 1}),
        );
        const trend = listTrend(counts, '2026-02', '야식');

        expect(trend.map(({month}) => month)).toEqual(['2025-11', '2025-12', '2026-01', '2026-02']);
      });

      it('1월의 지난달 횟수를 전년 12월 횟수로 반환해야 한다', () => {
        const counts = countTagsByMonth(
          createMonthlyRecords('야식', {'2025-11': 1, '2025-12': 3, '2026-01': 2, '2026-02': 1}),
        );
        const trend = listTrend(counts, '2026-02', '야식');

        expect(trend[2]).toMatchObject({month: '2026-01', previousCount: 3});
      });
    });
  });

  describe('Edge cases', () => {
    describe('처음 나온 달이 최근 6개월보다 앞이고 그 뒤로 한동안 안 나온 태그', () => {
      it('최근 6개월의 첫 달부터 반환해야 한다', () => {
        const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-02': 1, [QUERY_MONTH]: 1}));
        const trend = listTrend(counts, QUERY_MONTH, '야식');

        expect(trend.map(({month}) => month)).toEqual(RECENT_SIX_MONTHS);
      });

      it('안 나온 달은 0번으로 반환해야 한다', () => {
        const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-02': 1, [QUERY_MONTH]: 1}));
        const trend = listTrend(counts, QUERY_MONTH, '야식');

        expect(trend.map(({count}) => count)).toEqual([0, 0, 0, 0, 0, 1]);
      });
    });

    describe('지난달에만 나오고 조회하는 달에는 0번인 태그', () => {
      it('마지막 달의 횟수를 0번으로 반환해야 한다', () => {
        const counts = countTagsByMonth(createMonthlyRecords('늦잠', {'2026-08': 3}));
        const trend = listTrend(counts, QUERY_MONTH, '늦잠');

        expect(trend.at(-1)).toMatchObject({month: QUERY_MONTH, count: 0});
      });

      it('마지막 달의 지난달 횟수를 3번으로 반환해야 한다', () => {
        const counts = countTagsByMonth(createMonthlyRecords('늦잠', {'2026-08': 3}));
        const trend = listTrend(counts, QUERY_MONTH, '늦잠');

        expect(trend.at(-1)).toMatchObject({month: QUERY_MONTH, previousCount: 3});
      });
    });

    it('최근 6개월 바로 앞 달이 0번이면 맨 앞 달의 지난달 횟수를 0번으로 반환해야 한다', () => {
      const counts = countTagsByMonth(createEveryMonthRecords('늦잠', '2026-01', {'2026-03': 0}));

      const [first] = listTrend(counts, QUERY_MONTH, '늦잠');

      expect(first).toMatchObject({month: '2026-04', previousCount: 0});
    });

    it('조회하는 달 뒤에 기록이 있어도 그 뒤 달은 반환하지 않아야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {'2026-07': 1, '2026-08': 1, '2026-09': 1}));

      const trend = listTrend(counts, '2026-08', '야식');

      expect(trend.map(({month}) => month)).toEqual(['2026-07', '2026-08']);
    });

    it('맨 앞 달도 바로 앞 달의 횟수보다 적으면 줄어든 달로 반환해야 한다', () => {
      const counts = countTagsByMonth(createEveryMonthRecords('늦잠', '2026-01', {'2026-03': 5}));
      const [first] = listTrend(counts, QUERY_MONTH, '늦잠');

      expect(first).toMatchObject({month: '2026-04', status: 'reduced'});
    });

    it('한 번도 나오지 않은 태그는 빈 배열을 반환해야 한다', () => {
      const counts = countTagsByMonth(createMonthlyRecords('야식', {[QUERY_MONTH]: 1}));

      expect(listTrend(counts, QUERY_MONTH, '두통')).toEqual([]);
    });
  });
});

const QUERY_MONTH = '2026-09';
const RECENT_SIX_MONTHS = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', QUERY_MONTH];

function createMonthlyRecords(tag: string, monthlyCounts: Record<string, number>) {
  return Object.entries(monthlyCounts).flatMap(([month, count]) =>
    Array.from(Array(count).keys(), (index) =>
      createTestRecord(`${month}-${String(index + 1).padStart(2, '0')}`, {failTags: [tag]}),
    ),
  );
}

function createEveryMonthRecords(tag: string, from: string, overrides: Record<string, number> = {}) {
  const monthlyCounts: Record<string, number> = {};
  for (let month = from; month <= QUERY_MONTH; month = addMonths(month, 1)) {
    monthlyCounts[month] = overrides[month] ?? 1;
  }
  return createMonthlyRecords(tag, monthlyCounts);
}
