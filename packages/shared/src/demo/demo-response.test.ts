import {parseDateParam, shiftMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {describe, expect, it} from 'vitest';
import {getDemoResponse} from './demo-response';

describe('getDemoResponse()', () => {
  describe('General cases', () => {
    it('달을 넘기지 않으면 기준일로 이번 달 말일을 반환한다', () => {
      expect(getDemoResponse(null, NOW).today).toBe('2026-10-31');
    });

    it('달을 넘기지 않으면 이번 달 월간 통계를 반환한다', () => {
      expect(getDemoResponse(null, NOW).monthly?.month).toBe('2026-10');
    });

    it('지난 달을 넘기면 그 달 월간 통계를 반환한다', () => {
      expect(getDemoResponse(LAST_MONTH, NOW).monthly?.month).toBe('2026-09');
    });

    it('지난 달을 넘겨도 기준일은 달을 넘기지 않은 때와 같다', () => {
      expect(getDemoResponse(LAST_MONTH, NOW).today).toBe(getDemoResponse(null, NOW).today);
    });

    it('지난 달을 넘겨도 누적 요약은 달을 넘기지 않은 때와 같다', () => {
      expect(getDemoResponse(LAST_MONTH, NOW).overview).toEqual(getDemoResponse(null, NOW).overview);
    });
  });

  describe('Boundary cases', () => {
    it('다음 달을 넘기면 월간 통계로 null을 반환한다', () => {
      expect(getDemoResponse(NEXT_MONTH, NOW).monthly).toBeNull();
    });

    it('다음 달을 넘겨도 기준일은 달을 넘기지 않은 때와 같다', () => {
      expect(getDemoResponse(NEXT_MONTH, NOW).today).toBe(getDemoResponse(null, NOW).today);
    });

    it('다음 달을 넘겨도 기록은 달을 넘기지 않은 때와 같다', () => {
      expect(getDemoResponse(NEXT_MONTH, NOW).records).toEqual(getDemoResponse(null, NOW).records);
    });

    it('다음 달을 넘겨도 누적 요약은 달을 넘기지 않은 때와 같다', () => {
      expect(getDemoResponse(NEXT_MONTH, NOW).overview).toEqual(getDemoResponse(null, NOW).overview);
    });

    it('첫 기록 달의 한 달 앞을 넘기면 월간 통계로 null을 반환한다', () => {
      const firstRecordMonth = parseDateParam(getDemoResponse(null, NOW).overview.firstRecordDate);

      expect(getDemoResponse(shiftMonth(firstRecordMonth, -1), NOW).monthly).toBeNull();
    });

    it('첫 기록 달을 넘기면 그 달 월간 통계를 반환한다', () => {
      const firstRecordMonth = parseDateParam(getDemoResponse(null, NOW).overview.firstRecordDate);

      expect(getDemoResponse(firstRecordMonth, NOW).monthly?.month).toBe(toMonthParam(firstRecordMonth));
    });
  });
});

const NOW = new Date('2026-10-12T12:00:00+09:00');
const THIS_MONTH = {year: 2026, month: 10};
const LAST_MONTH = shiftMonth(THIS_MONTH, -1);
const NEXT_MONTH = shiftMonth(THIS_MONTH, 1);
