import {describe, expect, it} from 'vitest';
import {calculateMonthly} from './monthly';
import {createTestRecord} from './test-record';

const TODAY = '2026-09-24';
const TOMORROW = '2026-09-25';
const THIS_MONTH = '2026-09';
const LAST_MONTH = '2026-08';

describe('calculateMonthly()', () => {
  describe('진행 여부', () => {
    describe('General cases', () => {
      it('오늘이 속한 달을 조회하면 아직 끝나지 않은 달이어야 한다', () => {
        expect(calculateMonthly([], THIS_MONTH, TODAY)).toMatchObject({inProgress: true});
      });

      it('지난 달을 조회하면 끝난 달이어야 한다', () => {
        expect(calculateMonthly([], LAST_MONTH, TODAY)).toMatchObject({inProgress: false});
      });
    });
  });

  describe('기록한 날', () => {
    describe('General cases', () => {
      describe('이번 달', () => {
        it('오늘을 아직 기록하지 않았으면 기록한 날의 전체 날 수는 어제까지여야 한다', () => {
          const records = [createTestRecord('2026-09-01'), createTestRecord('2026-09-23')];

          expect(calculateMonthly(records, THIS_MONTH, TODAY).recordedDays).toEqual({count: 2, total: 23});
        });

        it('오늘을 기록했으면 기록한 날의 전체 날 수에 오늘도 들어가야 한다', () => {
          const records = [createTestRecord('2026-09-01'), createTestRecord('2026-09-23'), createTestRecord(TODAY)];

          expect(calculateMonthly(records, THIS_MONTH, TODAY).recordedDays).toEqual({count: 3, total: 24});
        });
      });

      it('끝난 달은 기록한 날의 전체 날 수가 그 달 마지막 날까지여야 한다', () => {
        const records = [createTestRecord('2026-08-31')];

        expect(calculateMonthly(records, LAST_MONTH, TODAY).recordedDays).toEqual({count: 1, total: 31});
      });

      it('이번 달을 조회하면 지난달 기록한 날도 함께 보여줘야 한다', () => {
        const records = [
          createTestRecord('2026-08-01'),
          createTestRecord('2026-08-02'),
          createTestRecord('2026-09-01'),
        ];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).previousRecordedDays).toEqual({count: 2, total: 31});
      });
    });

    describe('Boundary cases', () => {
      it('첫 기록이 이번 달이면 지난달 기록한 날은 보여주지 않아야 한다', () => {
        const records = [createTestRecord('2026-09-01')];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).previousRecordedDays).toBeNull();
      });

      it('첫 기록 뒤 지난달을 통째로 쉬었으면 지난달 기록한 날은 0일이어야 한다', () => {
        const records = [createTestRecord('2026-07-31'), createTestRecord('2026-09-01')];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).previousRecordedDays).toEqual({count: 0, total: 31});
      });

      describe('이번 달 1일', () => {
        it('오늘을 아직 기록하지 않았으면 기록한 날의 전체 날 수는 0일이어야 한다', () => {
          const records = [createTestRecord('2026-08-31')];

          expect(calculateMonthly(records, THIS_MONTH, '2026-09-01').recordedDays).toEqual({count: 0, total: 0});
        });
      });
    });

    describe('Edge cases', () => {
      it('오늘보다 뒤 날짜의 기록은 기록한 날로 세지 않아야 한다', () => {
        const records = [createTestRecord('2026-09-23'), createTestRecord(TODAY), createTestRecord(TOMORROW)];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).recordedDays).toEqual({count: 2, total: 24});
      });

      it('이번 달 기록이 하나도 없으면 기록한 날이 0일이어야 한다', () => {
        const records = [createTestRecord('2026-08-01')];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).recordedDays).toEqual({count: 0, total: 23});
      });

      it('기록이 하나도 없으면 지난달 기록한 날은 보여주지 않아야 한다', () => {
        expect(calculateMonthly([], THIS_MONTH, TODAY).previousRecordedDays).toBeNull();
      });
    });
  });

  describe('공부', () => {
    describe('General cases', () => {
      const records = [
        createTestRecord('2026-08-03', {dateType: 'weekday', minutes: {morning: 100}}),
        createTestRecord('2026-08-08', {dateType: 'holiday', minutes: {afternoon: 45}}),
        createTestRecord('2026-09-01', {dateType: 'weekday', minutes: {morning: 60, afternoon: 60}}),
        createTestRecord('2026-09-02', {dateType: 'weekday', minutes: {morning: 61}}),
        createTestRecord('2026-09-06', {dateType: 'holiday', minutes: {evening: 30}}),
      ];

      it('총 공부시간은 이번 달 기록의 공부시간 합이어야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study).toMatchObject({totalMinutes: 211});
      });

      it('평일 평균은 이번 달 평일 기록의 평균을 분 단위로 반올림한 값이어야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study).toMatchObject({weekdayAvg: 91});
      });

      it('휴일 평균은 이번 달 휴일 기록의 평균이어야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study).toMatchObject({holidayAvg: 30});
      });

      it('지난달 평일 평균은 지난달 평일 기록의 평균이어야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study).toMatchObject({prevWeekdayAvg: 100});
      });

      it('지난달 휴일 평균은 지난달 휴일 기록의 평균이어야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study).toMatchObject({prevHolidayAvg: 45});
      });
    });

    describe('Edge cases', () => {
      const records = [createTestRecord('2026-09-01', {dateType: 'weekday', minutes: {morning: 60}})];

      it('이번 달에 휴일 기록이 없으면 휴일 평균은 보여주지 않아야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study.holidayAvg).toBeNull();
      });

      it('지난달에 기록이 없으면 지난달 평일 평균은 보여주지 않아야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study.prevWeekdayAvg).toBeNull();
      });

      it('지난달에 기록이 없으면 지난달 휴일 평균은 보여주지 않아야 한다', () => {
        expect(calculateMonthly(records, THIS_MONTH, TODAY).study.prevHolidayAvg).toBeNull();
      });

      it('이번 달에 기록이 없으면 총 공부시간은 0분이어야 한다', () => {
        expect(calculateMonthly([], THIS_MONTH, TODAY).study.totalMinutes).toBe(0);
      });

      it('오늘보다 뒤 날짜의 기록은 공부시간에 넣지 않아야 한다', () => {
        const records = [
          createTestRecord(TODAY, {minutes: {morning: 30}}),
          createTestRecord(TOMORROW, {minutes: {morning: 90}}),
        ];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).study).toMatchObject({
          totalMinutes: 30,
          weekdayAvg: 30,
        });
      });
    });
  });

  describe('실패 태그', () => {
    describe('General cases', () => {
      it('지난달보다 많이 나온 태그는 반복하고 있는 태그로 분류해야 한다', () => {
        const records = [...createTagRecords(LAST_MONTH, {늦잠: 3}), ...createTagRecords(THIS_MONTH, {늦잠: 4})];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '늦잠', count: 4, previousCount: 3, status: 'repeated'},
        ]);
      });

      it('지난달에 없던 태그는 새로 생긴 태그로 분류해야 한다', () => {
        const records = createTagRecords(THIS_MONTH, {휴대폰: 2});

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '휴대폰', count: 2, previousCount: 0, status: 'appeared'},
        ]);
      });

      it('지난달보다 적게 나온 태그는 줄어든 태그로 분류해야 한다', () => {
        const records = [...createTagRecords(LAST_MONTH, {늦잠: 5}), ...createTagRecords(THIS_MONTH, {늦잠: 2})];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '늦잠', count: 2, previousCount: 5, status: 'reduced'},
        ]);
      });

      it('반복하고 있는 태그, 새로 생긴 태그, 줄어든 태그 순으로 놓여야 한다', () => {
        const records = [
          ...createTagRecords(LAST_MONTH, {늦잠: 3, 운동: 3, 휴대폰: 5}),
          ...createTagRecords(THIS_MONTH, {휴대폰: 2, 지각: 2, 늦잠: 4}),
        ];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '늦잠', count: 4, previousCount: 3, status: 'repeated'},
          {tag: '지각', count: 2, previousCount: 0, status: 'appeared'},
          {tag: '운동', count: 0, previousCount: 3, status: 'reduced'},
          {tag: '휴대폰', count: 2, previousCount: 5, status: 'reduced'},
        ]);
      });

      describe('줄어든 태그의 순서', () => {
        it('0번이 된 태그는 더 많이 줄어든 태그보다 앞에 놓여야 한다', () => {
          const records = [
            ...createTagRecords(LAST_MONTH, {늦잠: 1, 휴대폰: 5}),
            ...createTagRecords(THIS_MONTH, {휴대폰: 1}),
          ];

          expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
            {tag: '늦잠', count: 0, previousCount: 1, status: 'reduced'},
            {tag: '휴대폰', count: 1, previousCount: 5, status: 'reduced'},
          ]);
        });

        it('0번이 되지 않은 태그는 많이 줄어든 순이어야 한다', () => {
          const records = [
            ...createTagRecords(LAST_MONTH, {늦잠: 2, 휴대폰: 5}),
            ...createTagRecords(THIS_MONTH, {늦잠: 1, 휴대폰: 2}),
          ];

          expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
            {tag: '휴대폰', count: 2, previousCount: 5, status: 'reduced'},
            {tag: '늦잠', count: 1, previousCount: 2, status: 'reduced'},
          ]);
        });
      });
    });

    describe('Boundary cases', () => {
      it('지난달과 같은 횟수면 반복하고 있는 태그로 분류해야 한다', () => {
        const records = [...createTagRecords(LAST_MONTH, {늦잠: 3}), ...createTagRecords(THIS_MONTH, {늦잠: 3})];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '늦잠', count: 3, previousCount: 3, status: 'repeated'},
        ]);
      });

      it('이번 달 0번이 된 태그는 줄어든 태그로 분류해야 한다', () => {
        const records = [...createTagRecords(LAST_MONTH, {늦잠: 3}), createTestRecord(TODAY)];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '늦잠', count: 0, previousCount: 3, status: 'reduced'},
        ]);
      });
    });

    describe('Edge cases', () => {
      it('이번 달과 지난달에 실패 태그가 없으면 빈 목록이어야 한다', () => {
        const records = [
          createTestRecord('2026-07-31', {failTags: ['늦잠']}),
          createTestRecord('2026-08-31'),
          createTestRecord(TODAY),
        ];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([]);
      });

      it('지난달에만 실패가 있으면 모든 태그를 줄어든 태그로 분류해야 한다', () => {
        const records = createTagRecords(LAST_MONTH, {늦잠: 2, 휴대폰: 1});
        const {failureTags} = calculateMonthly(records, THIS_MONTH, TODAY);

        expect(failureTags).toHaveLength(2);
        expect(failureTags).toEqual(
          expect.arrayContaining([
            {tag: '늦잠', count: 0, previousCount: 2, status: 'reduced'},
            {tag: '휴대폰', count: 0, previousCount: 1, status: 'reduced'},
          ]),
        );
      });

      it('오늘보다 뒤 날짜의 기록은 실패 태그 횟수에 넣지 않아야 한다', () => {
        const records = [
          createTestRecord(TODAY, {failTags: ['늦잠']}),
          createTestRecord(TOMORROW, {failTags: ['늦잠']}),
        ];

        expect(calculateMonthly(records, THIS_MONTH, TODAY).failureTags).toEqual([
          {tag: '늦잠', count: 1, previousCount: 0, status: 'appeared'},
        ]);
      });
    });
  });
});

function createTagRecords(month: string, tagCounts: Record<string, number>) {
  const tags = Object.entries(tagCounts).flatMap(([tag, count]) => Array.from({length: count}, () => tag));

  return tags.map((tag, index) =>
    createTestRecord(`${month}-${String(index + 1).padStart(2, '0')}`, {failTags: [tag]}),
  );
}
