import {useState} from 'react';
import type {DemoChoiceReason} from '@plan-for-myself/shared/demo';
import {router, Slot} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {CLOSE_ICON_BUTTON_TEST_ID} from '@/shared/components/CloseIconButton';
import LoggedInDemoChoiceDialog from './LoggedInDemoChoiceDialog';

interface DialogLayoutProps {
  reason: DemoChoiceReason;
}

describe('LoggedInDemoChoiceDialog', () => {
  describe('General cases', () => {
    describe('날짜 칸을 눌러 열리면', () => {
      it('기록할 수 없다는 안내가 제목으로 보여야 한다', async () => {
        await renderDialog('date-click');

        expect(screen.getByText('예시 화면에서는 기록할 수 없어요')).toBeOnTheScreen();
      });

      it('제목 아래에 설명이 보이지 않아야 한다', async () => {
        await renderDialog('date-click');

        expect(screen.queryByText('내 달력을 만들면 바로 적을 수 있어요.')).not.toBeOnTheScreen();
      });
    });

    describe('말풍선이 끝나 열리면', () => {
      it('내 달력에서 이어서 적기를 권하는 제목이 보여야 한다', async () => {
        await renderDialog('tour-end');

        expect(screen.getByText('이제 내 달력에서 이어서 적어 보세요')).toBeOnTheScreen();
      });

      it('제목 아래에 설명이 보이지 않아야 한다', async () => {
        await renderDialog('tour-end');

        expect(screen.queryByText('지금까지 본 건 예시예요.')).not.toBeOnTheScreen();
        expect(screen.queryByText('실패를 적으면 내 기록으로 채워져요.')).not.toBeOnTheScreen();
      });
    });

    describe('[내 달력으로 이동]을 누르면', () => {
      it('창이 닫혀야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click', '/demo');

        await user.press(screen.getByText(MY_CALENDAR_LABEL));

        expect(screen.queryByText(CONTINUE_LABEL)).not.toBeOnTheScreen();
      });

      it('내 달력 화면으로 가야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderDialog('date-click', '/demo');
        await rendered;

        await user.press(screen.getByText(MY_CALENDAR_LABEL));

        expect(rendered.getPathname()).toBe('/');
      });

      it('뒤로 가도 예시 화면으로 돌아오지 않아야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click', '/demo');

        await user.press(screen.getByText(MY_CALENDAR_LABEL));

        expect(router.canGoBack()).toBe(false);
      });
    });

    describe('「계속 둘러보기」를 누르면', () => {
      it('창이 닫혀야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click', '/demo');

        await user.press(screen.getByText(CONTINUE_LABEL));

        expect(screen.queryByText(CONTINUE_LABEL)).not.toBeOnTheScreen();
      });

      it('누르기 전 화면에 머물러 있어야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderDialog('date-click', '/demo');
        await rendered;

        await user.press(screen.getByText(CONTINUE_LABEL));

        expect(rendered.getPathname()).toBe('/demo');
      });
    });

    describe('×를 누르면', () => {
      it('창이 닫혀야 한다', async () => {
        const user = userEvent.setup();
        await renderDialog('date-click', '/demo');

        await user.press(screen.getByTestId(CLOSE_ICON_BUTTON_TEST_ID));

        expect(screen.queryByText(CONTINUE_LABEL)).not.toBeOnTheScreen();
      });

      it('누르기 전 화면에 머물러 있어야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderDialog('date-click', '/demo');
        await rendered;

        await user.press(screen.getByTestId(CLOSE_ICON_BUTTON_TEST_ID));

        expect(rendered.getPathname()).toBe('/demo');
      });
    });
  });
});

const MY_CALENDAR_LABEL = '내 달력으로 이동';
const CONTINUE_LABEL = '계속 둘러보기';

function renderDialog(reason: DemoChoiceReason, initialUrl = '/') {
  return renderRouter(
    {
      ['_layout']: () => <DialogLayout reason={reason} />,
      index: EmptyScreen,
      demo: EmptyScreen,
    },
    {initialUrl},
  );
}

function DialogLayout({reason}: DialogLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Slot />
      <LoggedInDemoChoiceDialog isOpen={isOpen} reason={reason} onClose={() => setIsOpen(false)} />
    </>
  );
}

function EmptyScreen() {
  return null;
}
