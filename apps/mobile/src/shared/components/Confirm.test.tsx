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
