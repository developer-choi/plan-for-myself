// @vitest-environment node
import {NextRequest} from 'next/server';
import {redirect} from 'next/navigation';
import {describe, expect, it, vi} from 'vitest';
import {signOut} from '@/auth/next-auth';
import {GET} from './route';

vi.mock(import('@/auth/next-auth'), () => ({signOut: vi.fn()}));
vi.mock(import('next/navigation'), () => ({redirect: vi.fn<typeof redirect>()}));

describe('GET /api/next-auth/logout', () => {
  it('세션을 끊고, 보던 주소를 돌아올 곳으로 붙여 로그인 페이지로 보낸다', async () => {
    const calendarPath = '/study-records/2026/10';

    await GET(new NextRequest(`http://localhost/api/next-auth/logout?redirect=${encodeURIComponent(calendarPath)}`));

    expect(signOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(`/guest/login?redirect=${encodeURIComponent(calendarPath)}`);
  });
});
