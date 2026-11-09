import {useState} from 'react';
import type {CalendarMonth} from '@plan-for-myself/shared';
import Text from '@/shared/components/Text';
import {describe, expect, it} from '@jest/globals';
import {render, screen, userEvent} from '@testing-library/react-native';
import CalendarGrid from './CalendarGrid';

describe('CalendarGrid', () => {
  describe('General cases', () => {
    it('오늘보다 뒤의 날짜 칸을 누르면 미래 날짜를 눌렀다고 알려야 한다', async () => {
      const user = userEvent.setup();
      await render(<GridWithResult />);

      await user.press(screen.getByText('20'));

      expect(screen.getByText(FUTURE_RESULT)).toBeOnTheScreen();
    });
  });

  describe('Boundary cases', () => {
    it('오늘 칸을 누르면 미래 날짜를 눌렀다고 알리지 않아야 한다', async () => {
      const user = userEvent.setup();
      await render(<GridWithResult />);

      await user.press(screen.getByText('15'));

      expect(screen.getByText(NOT_PRESSED)).toBeOnTheScreen();
    });
  });
});

const OCTOBER: CalendarMonth = {year: 2026, month: 10};
const OCTOBER_TODAY = '2026-10-15';
const FUTURE_RESULT = '미래';
const NOT_PRESSED = '누르기 전';

function GridWithResult() {
  const [result, setResult] = useState(NOT_PRESSED);

  return (
    <>
      <CalendarGrid
        handlers={{onFutureDateClick: () => setResult(FUTURE_RESULT)}}
        month={OCTOBER}
        records={[]}
        today={OCTOBER_TODAY}
      />
      <Text>{result}</Text>
    </>
  );
}
