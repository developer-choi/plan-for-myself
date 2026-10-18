import {STUDY_RECORD_FIELD_MESSAGES} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it} from 'vitest';
import RecordFormDialog from './RecordFormDialog';

describe('RecordFormDialog', () => {
  describe('Edge cases', () => {
    [
      {label: '세 칸이 빈칸이면', minutes: ['', '', '']},
      {label: '세 칸이 공백이면', minutes: [' ', ' ', ' ']},
      {label: '세 칸이 0이면', minutes: ['0', '0', '0']},
    ].forEach(({label, minutes}) => {
      describe(label, () => {
        it('실패 태그 없이 [저장]을 누르면 빈 기록 문구가 뜬다', async () => {
          renderDialog();

          await typeMinutes(minutes);
          await userEvent.click(getSaveButton());

          expect(screen.getByRole('note')).toHaveTextContent(EMPTY_RECORD_TEXT);
        });
      });
    });

    describe('빈 기록 문구가 뜬 뒤', () => {
      it('실패 태그를 입력하고 Enter를 누르면 문구가 사라진다', async () => {
        renderDialog();

        await userEvent.click(getSaveButton());
        await userEvent.type(getFailTagField(), `${FAIL_TAG}{Enter}`);

        expect(screen.queryByRole('note')).not.toBeInTheDocument();
      });

      it('실패 태그 칸에 입력만 해도 문구가 사라진다', async () => {
        renderDialog();

        await userEvent.click(getSaveButton());
        await userEvent.type(getFailTagField(), FAIL_TAG);

        expect(screen.queryByRole('note')).not.toBeInTheDocument();
      });
    });
  });
});

const FAIL_TAG = '늦잠';
const MINUTE_LABELS = ['아침', '점심', '저녁'];

/* 화면에서는 두 문장을 줄바꿈으로 나눠 보인다 */
const EMPTY_RECORD_TEXT = STUDY_RECORD_FIELD_MESSAGES.emptyRecord.replace('\n', ' ');

function getMinuteField(label: string) {
  return screen.getByRole('textbox', {name: `${label} 분`});
}

function getFailTagField() {
  return screen.getByRole('textbox', {name: '실패 태그'});
}

function getSaveButton() {
  return screen.getByRole('button', {name: '저장'});
}

async function typeMinutes(minutes: string[]) {
  for (const [index, label] of MINUTE_LABELS.entries()) {
    if (minutes[index]) {
      await userEvent.type(getMinuteField(label), minutes[index]);
    }
  }
}

/* 이 테스트들은 저장 요청까지 가지 않아 창이 닫히지 않는다 */
function ignoreClose() {}

function renderDialog() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RecordFormDialog isOpen date="2026-10-07" month="2026-10" onClose={ignoreClose} />
    </QueryClientProvider>,
  );
}
