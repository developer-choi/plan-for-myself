import {useState} from 'react';
import {STUDY_RECORD_FIELD_MESSAGES, type StudyRecord} from '@plan-for-myself/shared/study-record';
import Text from '@/shared/components/Text';
import {describe, expect, it} from '@jest/globals';
import {CLOSE_ICON_BUTTON_TEST_ID} from '@/shared/components/CloseIconButton';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen, userEvent} from '@testing-library/react-native';
import RecordFormDialog from './RecordFormDialog';

interface DialogWithResultProps {
  /** 없으면 기록이 없는 날이다 */
  record?: StudyRecord;
}

describe('RecordFormDialog', () => {
  describe('General cases', () => {
    describe('기록이 없는 날이면', () => {
      it('[삭제]가 보이지 않아야 한다', async () => {
        await render(<DialogWithResult />);

        expect(screen.queryByText(DELETE_LABEL)).not.toBeOnTheScreen();
      });
    });

    describe('기록이 있는 날이면', () => {
      it('[삭제]가 보여야 한다', async () => {
        await render(<DialogWithResult record={RECORD} />);

        expect(screen.getByText(DELETE_LABEL)).toBeOnTheScreen();
      });
    });

    it('닫기를 누르면 창을 닫아야 한다', async () => {
      const user = userEvent.setup();
      await render(<DialogWithResult />);

      await user.press(screen.getByTestId(CLOSE_ICON_BUTTON_TEST_ID));

      expect(screen.getByText(CLOSED_RESULT)).toBeOnTheScreen();
    });
  });

  describe('Edge cases', () => {
    it('모든 칸이 비어 있을 때 [저장]을 누르면 빈 기록 안내가 보여야 한다', async () => {
      const user = userEvent.setup();
      await render(<DialogWithResult />);

      await user.press(screen.getByText(SAVE_LABEL));

      expect(screen.getByText(STUDY_RECORD_FIELD_MESSAGES.emptyRecord)).toBeOnTheScreen();
    });

    it('빈 기록 안내가 뜬 뒤 공부시간을 넣으면 안내가 사라져야 한다', async () => {
      const user = userEvent.setup();
      await render(<DialogWithResult />);
      await user.press(screen.getByText(SAVE_LABEL));

      await user.type(screen.getByTestId(MORNING_TEST_ID), MINUTES);

      expect(screen.queryByText(STUDY_RECORD_FIELD_MESSAGES.emptyRecord)).not.toBeOnTheScreen();
    });

    it('빈 기록 안내가 뜬 뒤 태그 칸에 입력만 해도 안내가 사라져야 한다', async () => {
      const user = userEvent.setup();
      await render(<DialogWithResult />);
      await user.press(screen.getByText(SAVE_LABEL));

      await user.type(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER), OVERSLEPT);

      expect(screen.queryByText(STUDY_RECORD_FIELD_MESSAGES.emptyRecord)).not.toBeOnTheScreen();
    });

    it('공부시간에 숫자가 아닌 글자를 넣고 [저장]을 누르면 공부시간 범위 안내가 보여야 한다', async () => {
      const user = userEvent.setup();
      await render(<DialogWithResult />);

      await user.type(screen.getByTestId(MORNING_TEST_ID), NOT_A_NUMBER);
      await user.press(screen.getByText(SAVE_LABEL));

      expect(screen.getByText(STUDY_RECORD_FIELD_MESSAGES.studiedMinutes)).toBeOnTheScreen();
    });

    it('태그 칸에 공백이 든 글자를 남긴 채 [저장]을 누르면 공백 금지 안내가 보여야 한다', async () => {
      const user = userEvent.setup();
      await render(<DialogWithResult />);
      await user.type(screen.getByTestId(MORNING_TEST_ID), MINUTES);

      await user.type(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER), TAG_WITH_SPACE);
      await user.press(screen.getByText(SAVE_LABEL));

      expect(screen.getByText(STUDY_RECORD_FIELD_MESSAGES.failTagSpace)).toBeOnTheScreen();
    });
  });
});

const DATE = '2026-10-21';

const MONTH = '2026-10';

const RECORD: StudyRecord = {pk: 7, date: DATE, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: []};

const SAVE_LABEL = '저장';

const DELETE_LABEL = '삭제';

const CLOSED_RESULT = '닫힘';

const FAIL_TAG_PLACEHOLDER = '단어 하나 입력 후 Enter';

const MORNING_TEST_ID = '아침 분';

const MINUTES = '30';

const NOT_A_NUMBER = 'abc';

const OVERSLEPT = '늦잠';

const TAG_WITH_SPACE = '늦 잠';

function DialogWithResult({record}: DialogWithResultProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [closed, setClosed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <RecordFormDialog isOpen date={DATE} month={MONTH} record={record} onClose={() => setClosed(true)} />
      <Text>{closed ? CLOSED_RESULT : ''}</Text>
    </QueryClientProvider>
  );
}
