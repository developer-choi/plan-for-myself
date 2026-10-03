import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import Page from './page';

describe('달력 페이지', () => {
  let navigatedHref: string | null;

  function recordNavigation(event: MouseEvent) {
    const anchor = (event.target as Element).closest('a');

    if (anchor) {
      event.preventDefault();
      navigatedHref = anchor.getAttribute('href');
    }
  }

  beforeEach(() => {
    navigatedHref = null;
    document.addEventListener('click', recordNavigation);
  });

  afterEach(() => {
    document.removeEventListener('click', recordNavigation);
  });

  it('☰ → 로그아웃을 누르면 지금 보던 달 주소를 싣고 로그아웃 라우트로 간다', async () => {
    const user = userEvent.setup();
    render(await Page({params: Promise.resolve({year: '2026', month: '10'})}));

    await user.click(screen.getByRole('button', {name: '메뉴'}));
    await user.click(screen.getByRole('menuitem', {name: '로그아웃'}));

    expect(navigatedHref).toBe(`/api/next-auth/logout?redirect=${encodeURIComponent('/study-records/2026/10')}`);
  });
});
