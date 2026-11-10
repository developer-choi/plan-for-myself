import type {GetDemoApiResponse} from '@plan-for-myself/shared';
import {NextRequest} from 'next/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {GET} from './route';

describe('GET /api/demo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('General cases', () => {
    it('달을 넘기지 않으면 이번 달 월간 통계를 반환한다', async () => {
      const response = (await GET(new NextRequest(DEMO_URL)).json()) as GetDemoApiResponse;

      expect(response.monthly?.month).toBe('2026-10');
    });

    it('지난 달을 넘기면 그 달 월간 통계를 반환한다', async () => {
      const lastMonth = '2026-09';

      const response = (await GET(new NextRequest(`${DEMO_URL}?month=${lastMonth}`)).json()) as GetDemoApiResponse;

      expect(response.monthly?.month).toBe(lastMonth);
    });
  });

  describe('Boundary cases', () => {
    it('형식이 틀린 달을 넘기면 400을 반환한다', () => {
      expect(GET(new NextRequest(`${DEMO_URL}?month=2026-13`)).status).toBe(BAD_REQUEST_STATUS);
    });
  });
});

const NOW = new Date('2026-10-12T12:00:00+09:00');
const DEMO_URL = 'http://localhost/api/demo';
const BAD_REQUEST_STATUS = 400;
