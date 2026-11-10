import {useState} from 'react';
import {describe, expect, it} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react-native';
import Confirm from './Confirm';

describe('Confirm', () => {
  describe('General cases', () => {
    describe('로딩 중이 아닐 때', () => {
      it('뒤로 가기를 누르면 창이 닫혀야 한다', async () => {
        await render(<ClosableConfirm loading={false} />);

        await fireEvent(screen.getByText(TITLE), 'requestClose');

        expect(screen.queryByText(TITLE)).not.toBeOnTheScreen();
      });
    });

    it('실패 문구를 넘기면 창 안에 보여야 한다', async () => {
      await render(<Confirm {...CONFIRM_PROPS} failure={FAILURE} />);

      expect(screen.getByText(FAILURE)).toBeOnTheScreen();
    });

    it('실패 문구를 넘기지 않으면 실패 문구가 없어야 한다', async () => {
      await render(<Confirm {...CONFIRM_PROPS} />);

      expect(screen.queryByText(FAILURE)).not.toBeOnTheScreen();
    });
  });

  describe('Edge cases', () => {
    describe('로딩 중일 때', () => {
      it('뒤로 가기를 눌러도 창이 남아 있어야 한다', async () => {
        await render(<ClosableConfirm loading />);

        await fireEvent(screen.getByText(TITLE), 'requestClose');

        expect(screen.getByText(TITLE)).toBeOnTheScreen();
      });
    });
  });
});

const TITLE = '삭제할까요?';
const FAILURE = '탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요';
const CONFIRM_PROPS = {
  open: true,
  title: TITLE,
  content: '되돌릴 수 없어요.',
  confirmLabel: '삭제',
  loading: false,
  handlers: {onCancel: () => {}, onConfirm: () => {}},
};

function ClosableConfirm({loading}: {loading: boolean}) {
  const [open, setOpen] = useState(true);

  return (
    <Confirm
      confirmLabel="삭제"
      content="되돌릴 수 없어요."
      handlers={{onCancel: () => setOpen(false), onConfirm: () => {}}}
      loading={loading}
      open={open}
      title={TITLE}
    />
  );
}
