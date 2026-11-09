import {useState} from 'react';
import type {DemoChoiceReason} from '@plan-for-myself/shared/demo';
import {router, Slot} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {CLOSE_ICON_BUTTON_TEST_ID} from '@/shared/components/CloseIconButton';
import LoggedOutDemoChoiceDialog from './LoggedOutDemoChoiceDialog';

interface DialogLayoutProps {
  reason: DemoChoiceReason;
}

describe('LoggedOutDemoChoiceDialog', () => {
  describe('General cases', () => {
    describe('날짜 칸을 눌러 열리면', () => {
      it('기록할 수 없다는 안내가 제목으로 보여야 한다', async () => {
        await renderDialog('date-click');

        expect(screen.getByText('예시 화면에서는 기록할 수 없어요')).toBeOnTheScreen();
      });

      it('달력을 만들면 적을 수 있다는 설명이 보여야 한다', async () => {
        await renderDialog('date-click');

        expect(screen.getByText('내 달력을 만들면 바로 적을 수 있어요.')).toBeOnTheScreen();
      });
    });

    describe('말풍선이 끝나 열리면', () => {
      it('내 달력에 적기를 권하는 제목이 보여야 한다', async () => {
        await renderDialog('tour-end');

        expect(screen.getByText('이제 내 달력에 적어 볼까요?')).toBeOnTheScreen();
      });

      it('지금까지 본 화면이 예시라는 설명이 보여야 한다', async () => {
        await renderDialog('tour-end');

        expect(screen.getByText('지금까지 본 건 예시예요.')).toBeOnTheScreen();
      });

      it('실패를 적으면 내 기록이 채워진다는 설명이 보여야 한다', async () => {
        await renderDialog('tour-end');

        expect(screen.getByText('실패를 적으면 내 기록으로 채워져요.')).toBeOnTheScreen();
      });
    });

    describe('[기록 시작하기]를 누르면', () => {
      it('창이 닫혀야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click');

        await user.press(screen.getByText(START_LABEL));

        expect(screen.queryByText(CONTINUE_LABEL)).not.toBeOnTheScreen();
      });

      it('로그인 화면으로 가야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderDialog('date-click');
        await rendered;

        await user.press(screen.getByText(START_LABEL));

        expect(rendered.getPathname()).toBe('/sign-in');
      });

      it('뒤로 가도 예시 화면으로 돌아오지 않아야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click');

        await user.press(screen.getByText(START_LABEL));

        expect(router.canGoBack()).toBe(false);
      });
    });

    describe('「계속 둘러보기」를 누르면', () => {
      it('창이 닫혀야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click');

        await user.press(screen.getByText(CONTINUE_LABEL));

        expect(screen.queryByText(CONTINUE_LABEL)).not.toBeOnTheScreen();
      });

      it('누르기 전 화면에 머물러 있어야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderDialog('date-click');
        await rendered;

        await user.press(screen.getByText(CONTINUE_LABEL));

        expect(rendered.getPathname()).toBe('/demo');
      });
    });

    describe('×를 누르면', () => {
      it('창이 닫혀야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click');

        await user.press(screen.getByTestId(CLOSE_ICON_BUTTON_TEST_ID));

        expect(screen.queryByText(CONTINUE_LABEL)).not.toBeOnTheScreen();
      });

      it('누르기 전 화면에 머물러 있어야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderDialog('date-click');
        await rendered;

        await user.press(screen.getByTestId(CLOSE_ICON_BUTTON_TEST_ID));

        expect(rendered.getPathname()).toBe('/demo');
      });
    });
  });
});

const START_LABEL = '기록 시작하기';
const CONTINUE_LABEL = '계속 둘러보기';

function renderDialog(reason: DemoChoiceReason) {
  return renderRouter(
    {
      ['_layout']: () => <DialogLayout reason={reason} />,
      demo: EmptyScreen,
      'sign-in': EmptyScreen,
    },
    {initialUrl: '/demo'},
  );
}

function DialogLayout({reason}: DialogLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Slot />
      <LoggedOutDemoChoiceDialog isOpen={isOpen} reason={reason} onClose={() => setIsOpen(false)} />
    </>
  );
}

function EmptyScreen() {
  return null;
}
