import {render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import LoginNudgeCard from './LoginNudgeCard';

describe('LoginNudgeCard', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('General cases', () => {
    it('기록이 있고 닫은 적이 없으면 Google 계정 연결 안내가 보인다', () => {
      render(<LoginNudgeCard recordedDays={RECORDED_DAYS} today={TODAY} />);

      expect(screen.getByText(NUDGE_TEXT)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('기록이 없으면 안내가 보이지 않는다', () => {
      render(<LoginNudgeCard recordedDays={0} today={TODAY} />);

      expect(screen.queryByText(NUDGE_TEXT)).not.toBeInTheDocument();
    });
  });
});

const TODAY = '2026-10-04';
const RECORDED_DAYS = 3;
const NUDGE_TEXT = /Google 계정을 연결하지 않으면/;
