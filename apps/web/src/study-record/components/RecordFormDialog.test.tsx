import {ApiResponseError} from '@developer-choi/utils/api';
import {STUDY_RECORD_FIELD_MESSAGES, type StudyRecord} from '@plan-for-myself/shared';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {
  FAIL_TAG_DUPLICATE_MESSAGE,
  UNEXPECTED_DELETE_FAILURE_MESSAGE,
  UNEXPECTED_FAILURE_MESSAGE,
} from '@/study-record/record-form';
import RecordFormDialog from './RecordFormDialog';

const DATE = '2026-10-07';
const DUPLICATE_DATE_REJECTION = {status: 409, code: 'DUPLICATE_DATE', message: '이 날짜엔 이미 기록이 있어요'};
const NOT_FOUND_REJECTION = {status: 404, code: 'NOT_FOUND', message: '기록을 찾을 수 없어요'};
const FULL_FAIL_TAGS_PLACEHOLDER = '최대 2개까지';

interface RenderFormParams {
  date?: string;
  record?: StudyRecord;
  onSave?: (fields: unknown) => Promise<unknown>;
  onDelete?: () => Promise<unknown>;
  onClose?: () => void;
  loading?: boolean;
}

function renderForm({
  date = DATE,
  record,
  onSave = vi.fn().mockResolvedValue(undefined),
  onDelete,
  onClose = vi.fn(),
  loading = false,
}: RenderFormParams = {}) {
  render(
    <RecordFormDialog
      isOpen
      date={date}
      loading={loading}
      record={record}
      onClose={onClose}
      onDelete={onDelete}
      onSave={onSave}
    />,
  );
}

function createRecord(overrides: Partial<StudyRecord> = {}): StudyRecord {
  return {pk: 1, date: DATE, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: [], ...overrides};
}

function createRejection({status, code, message}: {status: number; code: string; message: string}) {
  return new ApiResponseError({method: 'POST', status, url: '/api/study-records', errorData: {code, message}});
}

function pending() {
  return new Promise(() => {});
}

function getTagInput() {
  return screen.getByRole('textbox', {name: '실패 태그'});
}

/* 칸 안 단위 「분」도 이름에 붙는다 */
function getMinuteInput(label: string) {
  return screen.getByRole('textbox', {name: new RegExp(`^${label}`)});
}

function queryChipRemoveButton(tag: string) {
  return screen.queryByRole('button', {name: `${tag} 지우기`});
}

async function typeTag(tag: string) {
  await userEvent.type(getTagInput(), `${tag}{Enter}`);
}

async function clickSave() {
  await userEvent.click(screen.getByRole('button', {name: '저장'}));
}

async function clickDelete() {
  await userEvent.click(screen.getByRole('button', {name: '삭제'}));
}

describe('RecordFormDialog', () => {
  describe('처음 채워진 값', () => {
    [
      {label: '평일', date: '2026-10-07'},
      {label: '휴일', date: '2026-10-10'},
    ].forEach(({label, date}) => {
      it(`기록이 없는 ${label} 날짜로 열면 ${label}이 골라져 있다`, () => {
        renderForm({date});

        expect(screen.getByRole('radio', {name: label})).toBeChecked();
      });
    });

    it('기존 기록으로 열면 공부시간 칸에 그 기록의 분이 들어 있다', () => {
      const morningMinutes = 90;
      const eveningMinutes = 30;
      renderForm({record: createRecord({studiedMinutes: [morningMinutes, 0, eveningMinutes]})});

      [
        {label: '아침', minutes: morningMinutes},
        {label: '점심', minutes: 0},
        {label: '저녁', minutes: eveningMinutes},
      ].forEach(({label, minutes}) => {
        expect(getMinuteInput(label)).toHaveValue(String(minutes));
      });
    });
  });

  it('휴일을 고르고 저장하면 휴일로 저장된다', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    renderForm({onSave});

    await userEvent.click(screen.getByRole('radio', {name: '휴일'}));
    await clickSave();

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({dateType: 'holiday'}));
  });

  it('태그를 넣고 저장하면 그 태그로 저장된다', async () => {
    const tag = '영어';
    const onSave = vi.fn().mockResolvedValue(undefined);
    renderForm({onSave});

    await typeTag(tag);
    await clickSave();

    expect(onSave).toHaveBeenCalledWith({dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: [tag]});
  });

  it('아침에 분을 넣고 저장하면 그 분이 아침 공부시간으로 저장된다', async () => {
    const morningMinutes = 60;
    const onSave = vi.fn().mockResolvedValue(undefined);
    renderForm({onSave});

    await userEvent.type(getMinuteInput('아침'), String(morningMinutes));
    await clickSave();

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({studiedMinutes: [morningMinutes, 0, 0]}));
  });

  describe('실패 태그 입력', () => {
    it('태그 칸에 글자를 치고 Enter를 누르면 그 태그 칩이 생긴다', async () => {
      const tag = '영어';
      renderForm();

      await typeTag(tag);

      expect(queryChipRemoveButton(tag)).toBeInTheDocument();
    });

    it('태그를 넣으면 태그 칸이 비워진다', async () => {
      renderForm();

      await typeTag('영어');

      expect(getTagInput()).toHaveValue('');
    });

    it('태그 칸에서 Enter를 눌러도 저장되지 않는다', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      renderForm({onSave});

      await typeTag('영어');

      expect(onSave).not.toHaveBeenCalled();
    });

    describe('공백이 든 태그를 넣으면', () => {
      const tag = '영어 단어';

      it('칩이 생기지 않는다', async () => {
        renderForm();

        await typeTag(tag);

        expect(queryChipRemoveButton(tag)).not.toBeInTheDocument();
      });

      it('공백을 막는 문구가 보인다', async () => {
        renderForm();

        await typeTag(tag);

        expect(screen.getByRole('alert')).toHaveTextContent(STUDY_RECORD_FIELD_MESSAGES.failTagSpace);
      });
    });

    describe('이미 있는 태그를 다시 넣으면', () => {
      const tag = '영어';

      it('그 태그 칩이 하나만 있다', async () => {
        renderForm({record: createRecord({failTags: [tag]})});

        await typeTag(tag);

        expect(screen.getAllByRole('button', {name: `${tag} 지우기`})).toHaveLength(1);
      });

      it('중복을 막는 문구가 보인다', async () => {
        renderForm({record: createRecord({failTags: [tag]})});

        await typeTag(tag);

        expect(screen.getByRole('alert')).toHaveTextContent(FAIL_TAG_DUPLICATE_MESSAGE);
      });
    });

    describe('태그 2개가 찬 기록으로 열면', () => {
      const failTags = ['영어', '수학'];

      it('태그 칸이 비활성이다', () => {
        renderForm({record: createRecord({failTags})});

        expect(getTagInput()).toBeDisabled();
      });

      it('태그 칸에 최대 개수 안내가 보인다', () => {
        renderForm({record: createRecord({failTags})});

        expect(getTagInput()).toHaveAttribute('placeholder', FULL_FAIL_TAGS_PLACEHOLDER);
      });
    });

    [
      {label: '태그 없이', failTags: []},
      {label: '태그 1개로', failTags: ['영어']},
    ].forEach(({label, failTags}) => {
      describe(`${label} 열면`, () => {
        it('태그 칸이 활성이다', () => {
          renderForm({record: createRecord({failTags})});

          expect(getTagInput()).toBeEnabled();
        });

        it('태그 칸에 최대 개수 안내가 없다', () => {
          renderForm({record: createRecord({failTags})});

          expect(getTagInput()).not.toHaveAttribute('placeholder', FULL_FAIL_TAGS_PLACEHOLDER);
        });
      });
    });

    it('칩의 ×를 누르면 그 태그만 지워진다', async () => {
      const [removed, kept] = ['영어', '수학'];
      renderForm({record: createRecord({failTags: [removed, kept]})});

      await userEvent.click(screen.getByRole('button', {name: `${removed} 지우기`}));

      expect(queryChipRemoveButton(removed)).not.toBeInTheDocument();
      expect(queryChipRemoveButton(kept)).toBeInTheDocument();
    });

    describe('공백이 든 태그를 넣어 문구가 보일 때', () => {
      it('그 칸 글자를 고치면 문구가 사라진다', async () => {
        renderForm();
        await typeTag('영어 단어');

        await userEvent.type(getTagInput(), '{Backspace}');

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });

      it('칩을 지우면 그 문구가 사라진다', async () => {
        const tag = '수학';
        renderForm({record: createRecord({failTags: [tag]})});
        await typeTag('영어 단어');

        await userEvent.click(screen.getByRole('button', {name: `${tag} 지우기`}));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  it('저장하기 전에는 태그 칸에 글자를 쳐도 문구가 없다', async () => {
    renderForm();

    await userEvent.type(getTagInput(), '영어');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  describe('저장이 거절된 뒤', () => {
    it('태그 칸에 새로 쳐도 태그 문구가 없다', async () => {
      renderForm({onSave: vi.fn().mockRejectedValue(createRejection(DUPLICATE_DATE_REJECTION))});
      await clickSave();
      await screen.findByRole('note');

      await userEvent.type(getTagInput(), '영어');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Enter로 넣지 않은 태그 글자가 남은 채 저장하면', () => {
    interface SaveWithPendingTagParams {
      failTags?: string[];
      pendingTag?: string;
      onSave?: (fields: unknown) => Promise<unknown>;
    }

    async function saveWithPendingTag({
      failTags = [],
      pendingTag = '영어',
      onSave = vi.fn().mockResolvedValue(undefined),
    }: SaveWithPendingTagParams = {}) {
      renderForm({record: createRecord({failTags}), onSave});
      await userEvent.type(getTagInput(), pendingTag);
      await clickSave();
    }

    [
      {label: '태그 없이', failTags: [], pendingTag: '영어', expected: ['영어']},
      {label: '태그 1개가 있을 때', failTags: ['영어'], pendingTag: '수학', expected: ['영어', '수학']},
      {label: '앞뒤에 공백이 있어도', failTags: [], pendingTag: ' 영어 ', expected: ['영어']},
    ].forEach(({label, failTags, pendingTag, expected}) => {
      it(`${label} 남은 글자도 태그로 함께 저장된다`, async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);

        await saveWithPendingTag({failTags, pendingTag, onSave});

        await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({failTags: expected})));
      });
    });

    it('이미 있는 태그와 같은 글자면 막지 않고 기존 태그 그대로 저장된다', async () => {
      const failTags = ['Food'];
      const onSave = vi.fn().mockResolvedValue(undefined);

      await saveWithPendingTag({failTags, pendingTag: 'Food', onSave});

      await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({failTags})));
    });

    describe('공백이 든 글자면', () => {
      const pendingTag = '영어 단어';

      it('저장되지 않는다', async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);

        await saveWithPendingTag({pendingTag, onSave});

        expect(onSave).not.toHaveBeenCalled();
      });

      it('Enter로 넣을 때와 같은 문구가 보인다', async () => {
        await saveWithPendingTag({pendingTag});

        expect(await screen.findByRole('alert')).toHaveTextContent(STUDY_RECORD_FIELD_MESSAGES.failTagSpace);
      });

      it('태그 칸에 포커스가 간다', async () => {
        await saveWithPendingTag({pendingTag});

        await waitFor(() => expect(getTagInput()).toHaveFocus());
      });
    });

    describe('문구가 보일 때', () => {
      it('그 칸 글자를 고치면 문구가 사라진다', async () => {
        await saveWithPendingTag({pendingTag: '영어 단어'});
        await screen.findByRole('alert');

        await userEvent.type(getTagInput(), '{Backspace}');

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });

      it('칩을 지우면 문구가 사라진다', async () => {
        const tag = '수학';
        await saveWithPendingTag({failTags: [tag], pendingTag: '영어 단어'});
        await screen.findByRole('alert');

        await userEvent.click(screen.getByRole('button', {name: `${tag} 지우기`}));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  it('태그 칸에 공백만 남은 채 저장하면 기존 태그로 저장된다', async () => {
    const failTags = ['영어'];
    const onSave = vi.fn().mockResolvedValue(undefined);
    renderForm({record: createRecord({failTags}), onSave});
    await userEvent.type(getTagInput(), '   ');

    await clickSave();

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({failTags})));
  });

  describe('공부시간이 틀리고 태그 글자도 남은 채 저장하면', () => {
    async function saveWithMinuteError(pendingTag: string) {
      renderForm();
      await userEvent.type(getMinuteInput('아침'), 'abc');
      await userEvent.type(getTagInput(), pendingTag);
      await clickSave();
    }

    describe('넣을 수 있는 글자면', () => {
      it('공부시간 문구만 보인다', async () => {
        await saveWithMinuteError('영어');

        expect(await screen.findByRole('alert')).toHaveTextContent(STUDY_RECORD_FIELD_MESSAGES.studiedMinutes);
      });
    });

    describe('넣을 수 없는 글자면', () => {
      const pendingTag = '영어 단어';

      it('공부시간 문구가 보인다', async () => {
        await saveWithMinuteError(pendingTag);

        expect(await screen.findAllByRole('alert')).toContainEqual(
          expect.objectContaining({textContent: STUDY_RECORD_FIELD_MESSAGES.studiedMinutes}),
        );
      });

      it('태그 문구가 보인다', async () => {
        await saveWithMinuteError(pendingTag);

        expect(await screen.findAllByRole('alert')).toContainEqual(
          expect.objectContaining({textContent: STUDY_RECORD_FIELD_MESSAGES.failTagSpace}),
        );
      });

      it('위에 있는 태그 칸에 포커스가 간다', async () => {
        await saveWithMinuteError(pendingTag);

        await waitFor(() => expect(getTagInput()).toHaveFocus());
      });
    });
  });

  describe('공부시간 입력', () => {
    it('공부시간 칸에서 Enter를 누르면 저장된다', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      renderForm({onSave});

      await userEvent.type(getMinuteInput('아침'), '90{Enter}');

      await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    });

    it('숫자가 아닌 글자가 있으면 저장되지 않는다', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      renderForm({onSave});
      await userEvent.type(getMinuteInput('아침'), 'abc');

      await clickSave();

      expect(onSave).not.toHaveBeenCalled();
    });

    it('세 칸이 모두 틀려도 공부시간 문구는 하나만 보인다', async () => {
      renderForm();
      for (const label of ['아침', '점심', '저녁']) {
        await userEvent.type(getMinuteInput(label), 'abc');
      }

      await clickSave();

      expect(await screen.findAllByRole('alert')).toHaveLength(1);
      expect(screen.getByRole('alert')).toHaveTextContent(STUDY_RECORD_FIELD_MESSAGES.studiedMinutes);
    });
  });

  describe('[삭제] 버튼', () => {
    it('삭제 함수를 넘기면 [삭제] 버튼이 보인다', () => {
      renderForm({onDelete: vi.fn().mockResolvedValue(undefined)});

      expect(screen.getByRole('button', {name: '삭제'})).toBeInTheDocument();
    });

    it('삭제 함수 없이 열면 [삭제] 버튼이 없다', () => {
      renderForm();

      expect(screen.queryByRole('button', {name: '삭제'})).not.toBeInTheDocument();
    });
  });

  describe('저장·삭제 결과', () => {
    it('저장이 끝나면 모달이 닫힌다', async () => {
      const onClose = vi.fn();
      renderForm({onClose});

      await clickSave();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('삭제가 끝나면 모달이 닫힌다', async () => {
      const onClose = vi.fn();
      renderForm({record: createRecord(), onDelete: vi.fn().mockResolvedValue(undefined), onClose});

      await clickDelete();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    const tag = '영어';
    const morningMinutes = '90';

    async function saveRejected(error: Error, onClose = vi.fn()) {
      renderForm({onSave: vi.fn().mockRejectedValue(error), onClose});
      await typeTag(tag);
      await userEvent.type(getMinuteInput('아침'), morningMinutes);
      await clickSave();
      await screen.findByRole('note');
    }

    describe('저장이 거절되면', () => {
      it('서버가 보낸 거절 문구가 보인다', async () => {
        await saveRejected(createRejection(DUPLICATE_DATE_REJECTION));

        expect(await screen.findByRole('note')).toHaveTextContent(DUPLICATE_DATE_REJECTION.message);
      });

      it('모달이 닫히지 않는다', async () => {
        const onClose = vi.fn();

        await saveRejected(createRejection(DUPLICATE_DATE_REJECTION), onClose);

        expect(onClose).not.toHaveBeenCalled();
      });
    });

    it('서버 응답이 아닌 오류로 저장에 실패하면 저장하지 못했다는 문구가 보인다', async () => {
      await saveRejected(new Error('network'));

      expect(await screen.findByRole('note')).toHaveTextContent(UNEXPECTED_FAILURE_MESSAGE);
    });

    [
      {label: '서버가 거절해', error: createRejection(DUPLICATE_DATE_REJECTION)},
      {label: '서버 응답이 아닌 오류로', error: new Error('network')},
    ].forEach(({label, error}) => {
      describe(`${label} 저장에 실패하면`, () => {
        it('입력한 태그가 그대로 남는다', async () => {
          await saveRejected(error);

          expect(queryChipRemoveButton(tag)).toBeInTheDocument();
        });

        it('입력한 공부시간이 그대로 남는다', async () => {
          await saveRejected(error);

          expect(getMinuteInput('아침')).toHaveValue(morningMinutes);
        });
      });
    });

    describe('삭제가 거절되면', () => {
      async function deleteRejected(onClose = vi.fn()) {
        renderForm({
          record: createRecord(),
          onDelete: vi.fn().mockRejectedValue(createRejection(NOT_FOUND_REJECTION)),
          onClose,
        });
        await clickDelete();
        await screen.findByRole('note');
      }

      it('서버가 보낸 거절 문구가 보인다', async () => {
        await deleteRejected();

        expect(await screen.findByRole('note')).toHaveTextContent(NOT_FOUND_REJECTION.message);
      });

      it('모달이 닫히지 않는다', async () => {
        const onClose = vi.fn();

        await deleteRejected(onClose);

        expect(onClose).not.toHaveBeenCalled();
      });
    });

    it('서버 응답이 아닌 오류로 삭제에 실패하면 지우지 못했다는 문구가 보인다', async () => {
      renderForm({onDelete: vi.fn().mockRejectedValue(new Error('network'))});

      await clickDelete();

      expect(await screen.findByRole('note')).toHaveTextContent(UNEXPECTED_DELETE_FAILURE_MESSAGE);
    });

    describe('거절 문구가 보일 때', () => {
      it('다시 저장하면 결과가 오기 전에 그 문구가 사라진다', async () => {
        const onSave = vi
          .fn()
          .mockRejectedValueOnce(createRejection(DUPLICATE_DATE_REJECTION))
          .mockReturnValueOnce(pending());
        renderForm({onSave});
        await clickSave();
        await screen.findByRole('note');

        await clickSave();

        expect(screen.queryByRole('note')).not.toBeInTheDocument();
      });
    });

    describe('저장·삭제 중일 때', () => {
      it('[저장]을 눌러도 저장되지 않는다', async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);
        renderForm({onSave, loading: true});

        await clickSave();

        expect(onSave).not.toHaveBeenCalled();
      });

      it('공부시간 칸에서 Enter를 눌러도 저장되지 않는다', async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);
        renderForm({onSave, loading: true});

        await userEvent.type(getMinuteInput('아침'), '{Enter}');

        expect(onSave).not.toHaveBeenCalled();
      });

      it('[삭제]를 눌러도 삭제되지 않는다', async () => {
        const onDelete = vi.fn().mockResolvedValue(undefined);
        renderForm({record: createRecord(), onDelete, loading: true});

        await clickDelete();

        expect(onDelete).not.toHaveBeenCalled();
      });
    });
  });
});
