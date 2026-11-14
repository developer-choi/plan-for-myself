import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import type {LoginFailure} from '@plan-for-myself/shared/auth';
import LoginSection from './LoginSection';

describe('LoginSection', () => {
  describe('General cases', () => {
    describe('서버 401로 로그아웃된 뒤 열렸으면', () => {
      it('로그인이 풀렸다는 안내가 보여야 한다', async () => {
        await renderSection({failure: null, isSignedOutByServer: true});

        expect(screen.getByText(SIGNED_OUT_TITLE)).toBeOnTheScreen();
      });
    });

    describe('서버 401 로그아웃 없이 열렸으면', () => {
      it('로그인이 풀렸다는 안내가 없어야 한다', async () => {
        await renderSection({failure: null, isSignedOutByServer: false});

        expect(screen.queryByText(SIGNED_OUT_TITLE)).not.toBeOnTheScreen();
      });
    });
  });

  describe('Edge cases', () => {
    describe('서버 401로 로그아웃된 뒤 열렸어도 로그인에 실패했으면', () => {
      it('로그인이 풀렸다는 안내가 없어야 한다', async () => {
        await renderSection({failure: 'failed', isSignedOutByServer: true});

        expect(screen.queryByText(SIGNED_OUT_TITLE)).not.toBeOnTheScreen();
      });

      it('실패 안내가 보여야 한다', async () => {
        await renderSection({failure: 'failed', isSignedOutByServer: true});

        expect(screen.getByText(FAILED_TITLE)).toBeOnTheScreen();
      });
    });
  });
});

const SIGNED_OUT_TITLE = '로그인이 풀렸어요';
const FAILED_TITLE = '로그인하지 못했어요';
const NO_OPERATION_HANDLERS = {
  onSignIn: () => Promise.resolve(),
  onStartAsGuest: () => Promise.resolve(),
  onExit: () => {},
};

function renderSection({failure, isSignedOutByServer}: {failure: LoginFailure | null; isSignedOutByServer: boolean}) {
  return render(
    <LoginSection
      failure={failure}
      handlers={NO_OPERATION_HANDLERS}
      isSignedOutByServer={isSignedOutByServer}
      pendingAction={null}
    />,
  );
}
