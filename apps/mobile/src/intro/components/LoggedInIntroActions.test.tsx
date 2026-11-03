import {type Href, Redirect, router, Stack} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act, userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import LoggedInIntroActions from './LoggedInIntroActions';

describe('LoggedInIntroActions', () => {
  describe('General cases', () => {
    describe('달력에서 소개로 들어와 [내 달력으로 이동]을 누르면', () => {
      it('내 달력 화면으로 가야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderActions();
        await rendered;
        await act(() => router.push('/intro'));

        await user.press(screen.getByText(MY_CALENDAR_LABEL));

        expect(rendered.getPathname()).toBe(CALENDAR_PATH);
      });

      it('되돌아갈 화면이 없어야 한다', async () => {
        const user = userEvent.setup();
        await renderActions();
        await act(() => router.push('/intro'));

        await user.press(screen.getByText(MY_CALENDAR_LABEL));

        expect(router.canGoBack()).toBe(false);
      });
    });
  });
});

const MY_CALENDAR_LABEL = '내 달력으로 이동';
const CALENDAR_PATH = '/calendar';

function renderActions() {
  return renderRouter(
    {
      /* expo-router 파일 이름(`_layout`)이 레포 이름 규칙에 걸려 계산된 키로 적는다 */
      ['_layout']: () => <Stack />,
      index: HomeScreen,
      calendar: EmptyScreen,
      intro: LoggedInIntroActions,
    },
    {initialUrl: CALENDAR_PATH},
  );
}

function HomeScreen() {
  return <Redirect href={CALENDAR_PATH as Href} />;
}

function EmptyScreen() {
  return null;
}
