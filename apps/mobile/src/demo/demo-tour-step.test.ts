import {describe, expect, it} from '@jest/globals';
import {DEMO_TOUR_BUTTON_LABELS} from '@plan-for-myself/shared';
import {getNextTourStepIndex, getTourBubbleDisplay} from './demo-tour-step';

describe('getNextTourStepIndex()', () => {
  describe('General cases', () => {
    it('마지막이 아닌 단계를 넘기면 다음 단계 번호를 반환해야 한다', () => {
      expect(getNextTourStepIndex(0, STEP_COUNT)).toBe(1);
    });
  });

  describe('Boundary cases', () => {
    it('마지막 단계를 넘기면 null을 반환해야 한다', () => {
      expect(getNextTourStepIndex(STEP_COUNT - 1, STEP_COUNT)).toBeNull();
    });
  });
});

describe('getTourBubbleDisplay()', () => {
  describe('General cases', () => {
    describe('첫 번호가 3일 때', () => {
      it('두 번째 단계면 번호 4를 반환해야 한다', () => {
        const expectedNumber = 4;

        const {number} = getTourBubbleDisplay({...PARAMS, stepIndex: 1, firstNumber: 3});

        expect(number).toBe(expectedNumber);
      });
    });

    it('마지막이 아닌 단계는 버튼 글자로 「다음」을 반환해야 한다', () => {
      const {primaryLabel} = getTourBubbleDisplay({...PARAMS, stepIndex: 0});

      expect(primaryLabel).toBe(DEMO_TOUR_BUTTON_LABELS.next);
    });
  });

  describe('Boundary cases', () => {
    it('마지막 단계는 넘긴 마지막 버튼 글자를 반환해야 한다', () => {
      const {primaryLabel} = getTourBubbleDisplay({...PARAMS, stepIndex: STEP_COUNT - 1});

      expect(primaryLabel).toBe(LAST_LABEL);
    });
  });
});

const STEP_COUNT = 3;
const LAST_LABEL = '끝내기';
const PARAMS = {stepIndex: 0, stepCount: STEP_COUNT, firstNumber: 1, lastLabel: LAST_LABEL};
