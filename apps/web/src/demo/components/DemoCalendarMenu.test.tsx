import {MY_CALENDAR_LABEL} from '@/shared/labels';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it} from 'vitest';
import DemoCalendarMenu from './DemoCalendarMenu';

describe('DemoCalendarMenu', () => {
  describe('General cases', () => {
    describe('메뉴를 열면', () => {
      it('로그인 상태면 [내 달력으로 이동] 메뉴가 보여야 한다', async () => {
        render(<DemoCalendarMenu isLoggedIn />);

        await userEvent.click(screen.getByRole('button', {name: '메뉴'}));

        expect(await screen.findByRole('menuitem', {name: MY_CALENDAR_LABEL})).toBeInTheDocument();
      });

      it('로그아웃 상태면 [내 달력으로 이동] 메뉴는 안 보여야 한다', async () => {
        render(<DemoCalendarMenu isLoggedIn={false} />);

        await userEvent.click(screen.getByRole('button', {name: '메뉴'}));

        expect(await screen.findByRole('menuitem', {name: '서비스 소개'})).toBeInTheDocument();
        expect(screen.queryByRole('menuitem', {name: MY_CALENDAR_LABEL})).not.toBeInTheDocument();
      });
    });
  });
});
