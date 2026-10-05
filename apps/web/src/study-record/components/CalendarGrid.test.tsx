import type {StudyRecord} from '@plan-for-myself/shared';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import CalendarGrid from './CalendarGrid';

const MONTH = {year: 2026, month: 10};
const TODAY = '2026-10-04';
const LAST_DATE_OF_MONTH = '2026-10-31';

interface RenderGridParams {
  records?: StudyRecord[];
  onFutureDateClick?: () => void;
}

function createRecord(overrides: Partial<StudyRecord> = {}): StudyRecord {
  return {pk: 1, date: LAST_DATE_OF_MONTH, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: [], ...overrides};
}

function renderGrid({records = [], onFutureDateClick = vi.fn()}: RenderGridParams) {
  render(<CalendarGrid handlers={{onFutureDateClick}} month={MONTH} records={records} today={TODAY} />);
}

describe('CalendarGrid', () => {
  describe('General cases', () => {
    it('오늘 날짜를 넘기면 그 날짜 칸이 오늘로 표시된다', () => {
      renderGrid({});

      expect(screen.getByRole('button', {name: '4'})).toHaveAttribute('aria-current', 'date');
      expect(screen.getByRole('button', {name: '5'})).not.toHaveAttribute('aria-current');
    });

    it('기록이 있는 날 칸에는 날짜, 총 공부시간, 실패 태그가 차례로 보인다', () => {
      const day = 31;
      const totalTime = '1:30';
      const firstTag = '영어 단어';
      const secondTag = '알고리즘';
      const morningMinutes = 60;
      const afternoonMinutes = 30;
      const studiedMinutes: StudyRecord['studiedMinutes'] = [morningMinutes, afternoonMinutes, 0];
      renderGrid({
        records: [createRecord({date: `2026-10-${day}`, studiedMinutes, failTags: [firstTag, secondTag]})],
      });

      expect(screen.getByRole('button', {name: new RegExp(`^${day}`)})).toHaveTextContent(
        `${day}${totalTime}${firstTag}${secondTag}`,
      );
    });

    it('기록이 없는 날은 날짜만 보인다', () => {
      const emptyDay = 3;
      renderGrid({records: [createRecord({date: LAST_DATE_OF_MONTH})]});

      expect(screen.getByRole('button', {name: String(emptyDay)})).toHaveTextContent(new RegExp(`^${emptyDay}$`));
    });

    it('오늘보다 뒤인 칸을 누르면 미래 날짜 핸들러가 불린다', async () => {
      const onFutureDateClick = vi.fn();
      renderGrid({onFutureDateClick});

      await userEvent.click(screen.getByRole('button', {name: '5'}));

      expect(onFutureDateClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('오늘이나 지난 칸을 누르면 미래 날짜 핸들러가 불리지 않는다', async () => {
      const onFutureDateClick = vi.fn();
      renderGrid({onFutureDateClick});

      await userEvent.click(screen.getByRole('button', {name: '4'}));
      await userEvent.click(screen.getByRole('button', {name: '3'}));

      expect(onFutureDateClick).not.toHaveBeenCalled();
    });

    it('실패 태그가 셋 이상이어도 앞의 둘만 보인다', () => {
      const day = 31;
      const [first, second, third] = ['가', '나', '다'];
      renderGrid({records: [createRecord({date: `2026-10-${day}`, failTags: [first, second, third]})]});

      const button = screen.getByRole('button', {name: new RegExp(`^${day}`)});

      expect(button).toHaveTextContent(`${first}${second}`);
      expect(button).not.toHaveTextContent(third);
    });

    it('달 밖 칸은 누를 수 없다', () => {
      renderGrid({});

      const daysInMonth = 31;

      expect(screen.getAllByRole('button')).toHaveLength(daysInMonth);
    });
  });
});
