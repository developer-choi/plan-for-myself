import {useState} from 'react';
import type {CalendarMonth} from '@plan-for-myself/shared/date';
import type {StudyRecord} from '@plan-for-myself/shared/study-record';
import Text from '@/shared/components/Text';
import {describe, expect, it} from '@jest/globals';
import {render, screen, userEvent} from '@testing-library/react-native';
import CalendarGrid from './CalendarGrid';

interface GridWithResultProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
}

describe('CalendarGrid', () => {
  describe('General cases', () => {
    it('오늘보다 뒤의 날짜 칸을 누르면 미래 날짜를 눌렀다고 알려야 한다', async () => {
      const user = userEvent.setup();
      await render(<GridWithResult month={OCTOBER} records={[]} today={OCTOBER_TODAY} />);

      await user.press(screen.getByText('20'));

      expect(screen.getByText(FUTURE_RESULT)).toBeOnTheScreen();
    });

    it('기록이 있는 지난 날짜 칸을 누르면 그날 날짜와 기록을 넘겨야 한다', async () => {
      const user = userEvent.setup();
      const record: StudyRecord = {
        pk: 7,
        date: '2026-10-03',
        dateType: 'weekday',
        studiedMinutes: [0, 0, 0],
        failTags: [],
      };
      await render(<GridWithResult month={OCTOBER} records={[record]} today={OCTOBER_TODAY} />);

      await user.press(screen.getByText('3'));

      expect(screen.getByText(`${record.date}·${record.pk}`)).toBeOnTheScreen();
    });

    it('기록이 없는 지난 날짜 칸을 누르면 그날 날짜만 넘겨야 한다', async () => {
      const user = userEvent.setup();
      await render(<GridWithResult month={OCTOBER} records={[]} today={OCTOBER_TODAY} />);

      await user.press(screen.getByText('4'));

      expect(screen.getByText(`2026-10-04·${NO_RECORD}`)).toBeOnTheScreen();
    });
  });

  describe('Boundary cases', () => {
    it('오늘 칸을 누르면 지난 날짜처럼 그날 날짜를 넘겨야 한다', async () => {
      const user = userEvent.setup();
      await render(<GridWithResult month={OCTOBER} records={[]} today={OCTOBER_TODAY} />);

      await user.press(screen.getByText('15'));

      expect(screen.getByText(`${OCTOBER_TODAY}·${NO_RECORD}`)).toBeOnTheScreen();
    });

    it('앞 달 날짜 칸을 누르면 날짜를 넘기지 않아야 한다', async () => {
      const user = userEvent.setup();
      await render(<GridWithResult month={{year: 2026, month: 2}} records={[]} today="2026-02-15" />);

      await user.press(screen.getByText('31'));

      expect(screen.getByText(NOT_PRESSED)).toBeOnTheScreen();
    });
  });
});

const OCTOBER: CalendarMonth = {year: 2026, month: 10};
const OCTOBER_TODAY = '2026-10-15';
const FUTURE_RESULT = '미래';
const NO_RECORD = '기록 없음';
const NOT_PRESSED = '누르기 전';

function GridWithResult({month, today, records}: GridWithResultProps) {
  const [result, setResult] = useState(NOT_PRESSED);

  return (
    <>
      <CalendarGrid
        handlers={{
          onFutureDateClick: () => setResult(FUTURE_RESULT),
          onRecordableDateClick: (date, record) => setResult(`${date}·${record?.pk ?? NO_RECORD}`),
        }}
        month={month}
        records={records}
        today={today}
      />
      <Text>{result}</Text>
    </>
  );
}
