import {router, Stack} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import LoggedOutIntroActions from './LoggedOutIntroActions';

describe('LoggedOutIntroActions', () => {
  describe('General cases', () => {
    describe('[기록 시작하기]를 누르면', () => {
      it('로그인 화면으로 가야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderActions();
        await rendered;

        await user.press(screen.getByText(START_LABEL));

        expect(rendered.getPathname()).toBe('/sign-in');
      });

      it('되돌아갈 화면이 없어야 한다', async () => {
        const user = userEvent.setup();
        await renderActions();

        await user.press(screen.getByText(START_LABEL));

        expect(router.canGoBack()).toBe(false);
      });
    });
  });
});

const START_LABEL = '기록 시작하기';

function renderActions() {
  return renderRouter(
    {
      /* expo-router 파일 이름(`_layout`)이 레포 이름 규칙에 걸려 계산된 키로 적는다 */
      ['_layout']: () => <Stack />,
      intro: LoggedOutIntroActions,
      'sign-in': EmptyScreen,
    },
    {initialUrl: '/intro'},
  );
}

function EmptyScreen() {
  return null;
}
