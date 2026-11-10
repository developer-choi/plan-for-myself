import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import type {LoginFailure} from '@plan-for-myself/shared';
import GuestConnectSection from './GuestConnectSection';

describe('GuestConnectSection', () => {
  describe('General cases', () => {
    describe('거절되지 않았을 때', () => {
      describe('실패가 없으면', () => {
        it('연결 버튼이 보여야 한다', async () => {
          await renderSection({isRejected: false, failure: null});

          expect(screen.getByText(CONNECT_LABEL)).toBeOnTheScreen();
        });

        it('달력 링크가 보여야 한다', async () => {
          await renderSection({isRejected: false, failure: null});

          expect(screen.getByText(CALENDAR_LINK_LABEL)).toBeOnTheScreen();
        });

        it('거절 안내가 없어야 한다', async () => {
          await renderSection({isRejected: false, failure: null});

          expect(screen.queryByText(REJECTED_TITLE)).not.toBeOnTheScreen();
        });

        it('삭제 버튼이 없어야 한다', async () => {
          await renderSection({isRejected: false, failure: null});

          expect(screen.queryByText(DISCARD_LABEL)).not.toBeOnTheScreen();
        });
      });
    });

    describe('거절됐으면', () => {
      it('거절 안내가 보여야 한다', async () => {
        await renderSection({isRejected: true, failure: null});

        expect(screen.getByText(REJECTED_TITLE)).toBeOnTheScreen();
      });

      it('삭제 버튼이 보여야 한다', async () => {
        await renderSection({isRejected: true, failure: null});

        expect(screen.getByText(DISCARD_LABEL)).toBeOnTheScreen();
      });

      it('삭제하지 않고 돌아가는 버튼이 보여야 한다', async () => {
        await renderSection({isRejected: true, failure: null});

        expect(screen.getByText('삭제하지 않고 내 달력으로')).toBeOnTheScreen();
      });

      it('연결 버튼이 없어야 한다', async () => {
        await renderSection({isRejected: true, failure: null});

        expect(screen.queryByText(CONNECT_LABEL)).not.toBeOnTheScreen();
      });

      it('달력 링크가 없어야 한다', async () => {
        await renderSection({isRejected: true, failure: null});

        expect(screen.queryByText(CALENDAR_LINK_LABEL)).not.toBeOnTheScreen();
      });
    });
  });

  describe('Edge cases', () => {
    describe('거절됐을 때', () => {
      describe('삭제에 실패했으면', () => {
        it('실패 안내가 보여야 한다', async () => {
          await renderSection({isRejected: true, failure: 'failed'});

          expect(screen.getByText(FAILED_TITLE)).toBeOnTheScreen();
        });

        it('거절 안내가 없어야 한다', async () => {
          await renderSection({isRejected: true, failure: 'failed'});

          expect(screen.queryByText(REJECTED_TITLE)).not.toBeOnTheScreen();
        });
      });
    });

    describe('거절되지 않았을 때', () => {
      describe('실패했으면', () => {
        it('실패 안내가 보여야 한다', async () => {
          await renderSection({isRejected: false, failure: 'failed'});

          expect(screen.getByText(FAILED_TITLE)).toBeOnTheScreen();
        });

        it('연결 버튼이 보여야 한다', async () => {
          await renderSection({isRejected: false, failure: 'failed'});

          expect(screen.getByText(CONNECT_LABEL)).toBeOnTheScreen();
        });
      });
    });
  });
});

const CONNECT_LABEL = 'Google 계정 연결하기';
const CALENDAR_LINK_LABEL = '내 달력으로 이동';
const REJECTED_TITLE = '이 Google 계정은 연결할 수 없어요';
const DISCARD_LABEL = '게스트 계정 삭제 후 로그인';
const FAILED_TITLE = '로그인하지 못했어요';
const NO_OPERATION_HANDLERS = {onConnect: () => {}, onDiscard: () => Promise.resolve(), onLeave: () => {}};

function renderSection({isRejected, failure}: {isRejected: boolean; failure: LoginFailure | null}) {
  return render(
    <GuestConnectSection
      failure={failure}
      handlers={NO_OPERATION_HANDLERS}
      isPending={false}
      isRejected={isRejected}
    />,
  );
}
