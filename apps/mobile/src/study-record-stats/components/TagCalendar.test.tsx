import {describe, expect, it} from '@jest/globals';
import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {colors} from '@plan-for-myself/shared/color';
import {getTagCalendar} from '@plan-for-myself/shared/study-record-stats';
import {render, screen} from '@testing-library/react-native';
import {createStudyRecord} from '@/study-record-stats/test-utils';
import TagCalendar, {DAY_TEST_ID_PREFIX, LEADING_BLANK_TEST_ID} from './TagCalendar';

describe('TagCalendar', () => {
  describe('General cases', () => {
    it('그 태그를 적은 날 칸은 빨강이어야 한다', async () => {
      await render(<TagCalendar calendar={SEPTEMBER_CALENDAR} />);

      expect(screen.getByTestId(`${DAY_TEST_ID_PREFIX}${TAGGED_DAY}`)).toHaveStyle({backgroundColor: colors.fail});
    });

    it('그 태그를 적지 않은 날 칸은 페이지 바탕색이어야 한다', async () => {
      await render(<TagCalendar calendar={SEPTEMBER_CALENDAR} />);

      expect(screen.getByTestId(`${DAY_TEST_ID_PREFIX}${UNTAGGED_DAY}`)).toHaveStyle({backgroundColor: colors.page});
    });

    it('1일이 화요일인 달이면 1일 앞에 빈 칸이 하나 있어야 한다', async () => {
      await render(<TagCalendar calendar={SEPTEMBER_CALENDAR} />);

      const cells = screen.getAllByTestId(CELL_TEST_ID_PATTERN);
      expect(cells.indexOf(screen.getByTestId(LEADING_BLANK_TEST_ID))).toBe(0);
      expect(cells.indexOf(screen.getByTestId(`${DAY_TEST_ID_PREFIX}${FIRST_DAY}`))).toBe(1);
    });

    it('1일 앞 빈 칸에는 숫자가 없어야 한다', async () => {
      await render(<TagCalendar calendar={SEPTEMBER_CALENDAR} />);

      expect(screen.getByTestId(LEADING_BLANK_TEST_ID)).toBeEmptyElement();
    });
  });
});

const SEPTEMBER: CalendarMonth = {year: 2026, month: 9};
const TAG = '야식';
const TAGGED_DAY = 3;
const TAGGED_DATE = `2026-09-${String(TAGGED_DAY).padStart(2, '0')}`;
const FIRST_DAY = 1;
const UNTAGGED_DAY = 4;
const CELL_TEST_ID_PATTERN = new RegExp(`^(${LEADING_BLANK_TEST_ID}|${DAY_TEST_ID_PREFIX})`);
const SEPTEMBER_CALENDAR = getTagCalendar({
  month: SEPTEMBER,
  records: [createStudyRecord({date: TAGGED_DATE, failTags: [TAG]})],
  tag: TAG,
});
