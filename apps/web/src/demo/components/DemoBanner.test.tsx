import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import {MY_CALENDAR_LABEL, START_RECORDING_LABEL} from '@/shared/labels';
import DemoBanner from './DemoBanner';

describe('DemoBanner', () => {
  describe('General cases', () => {
    describe('로그아웃 상태면', () => {
      it('[기록 시작하기]를 누르면 로그인 화면으로 간다', () => {
        render(<DemoBanner isLoggedIn={false} />);

        expect(screen.getByText('꾸준히 기록하면 이렇게 보여요')).toBeInTheDocument();
        expect(screen.getByRole('link', {name: START_RECORDING_LABEL})).toHaveAttribute('href', '/login');
        expect(screen.queryByRole('link', {name: MY_CALENDAR_LABEL})).not.toBeInTheDocument();
      });
    });

    describe('로그인 상태면', () => {
      it('[내 달력으로 이동]을 누르면 내 달력으로 간다', () => {
        render(<DemoBanner isLoggedIn />);

        expect(screen.getByRole('link', {name: MY_CALENDAR_LABEL})).toHaveAttribute('href', DEFAULT_HOME_URL);
        expect(screen.queryByRole('link', {name: START_RECORDING_LABEL})).not.toBeInTheDocument();
      });
    });
  });
});
