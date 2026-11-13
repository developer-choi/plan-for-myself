import {openOnce} from '@plan-for-myself/shared/overlay';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {overlay, type OverlayControllerComponent, OverlayProvider} from 'overlay-kit';
import {type ComponentProps, StrictMode} from 'react';
import {afterEach, describe, expect, it} from 'vitest';

describe('openOnce()', () => {
  afterEach(() => {
    act(() => overlay.unmountAll());
  });

  describe('OverlayProvider가 마운트된 뒤 열면', () => {
    describe('General cases', () => {
      it('같은 키로 연달아 열면 하나만 뜬다', () => {
        renderProvider();

        act(() => {
          openOnce(KEY, Dialog);
          openOnce(KEY, Dialog);
        });

        expect(screen.getAllByRole('dialog')).toHaveLength(1);
      });

      it('다른 키는 열린 모달 위에 뜬다', () => {
        renderProvider();

        act(() => {
          openOnce(KEY, Dialog);
          openOnce(OTHER_KEY, Dialog);
        });

        expect(screen.getAllByRole('dialog')).toHaveLength(2);
      });

      it('unmount로 닫은 뒤 다시 열린다', async () => {
        renderProvider();
        act(() => openOnce(KEY, Dialog));

        await userEvent.click(screen.getByRole('button', {name: UNMOUNT_LABEL}));
        act(() => openOnce(KEY, Dialog));

        expect(screen.getAllByRole('dialog')).toHaveLength(1);
      });

      it('close로 닫은 뒤 다시 열린다', async () => {
        renderProvider();
        act(() => openOnce(KEY, Dialog));

        await userEvent.click(screen.getByRole('button', {name: CLOSE_LABEL}));
        act(() => openOnce(KEY, Dialog));

        expect(await screen.findAllByText(OPEN_TEXT)).toHaveLength(1);
      });
    });

    describe('Edge cases', () => {
      it('unmountAll로 닫은 뒤 다시 열린다', () => {
        renderProvider();
        act(() => openOnce(KEY, Dialog));

        act(() => overlay.unmountAll());
        act(() => openOnce(KEY, Dialog));

        expect(screen.getAllByRole('dialog')).toHaveLength(1);
      });

      it('close로 닫힌 모달이 다시 연 모달보다 늦게 언마운트돼도 같은 키로 또 열면 막힌다', async () => {
        renderProvider();
        act(() => openOnce(KEY, Dialog));
        await userEvent.click(screen.getByRole('button', {name: CLOSE_LABEL}));
        act(() => openOnce(KEY, Dialog));
        const [closedDialogUnmountButton] = screen.getAllByRole('button', {name: UNMOUNT_LABEL});

        await userEvent.click(closedDialogUnmountButton);
        act(() => openOnce(KEY, Dialog));

        expect(screen.getAllByRole('dialog')).toHaveLength(1);
      });

      it('StrictMode에서도 같은 키로 연달아 열면 하나만 뜬다', () => {
        render(
          <StrictMode>
            <OverlayProvider />
          </StrictMode>,
        );
        act(() => openOnce(KEY, Dialog));

        act(() => openOnce(KEY, Dialog));

        expect(screen.getAllByRole('dialog')).toHaveLength(1);
      });
    });
  });
});

const KEY = 'test';
const OTHER_KEY = 'other';
const UNMOUNT_LABEL = 'unmount';
const CLOSE_LABEL = 'close';
const OPEN_TEXT = '열림';
const CLOSED_TEXT = '닫힘';

function Dialog({isOpen, close, unmount}: ComponentProps<OverlayControllerComponent>) {
  return (
    <div role="dialog">
      <p>{isOpen ? OPEN_TEXT : CLOSED_TEXT}</p>
      <button onClick={unmount}>{UNMOUNT_LABEL}</button>
      <button onClick={close}>{CLOSE_LABEL}</button>
    </div>
  );
}

function renderProvider() {
  render(<OverlayProvider />);
}
