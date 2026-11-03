import {describe, expect, it} from '@jest/globals';
import {getSpotlightPath, getTourBubblePosition, padTourRect, TOUR_BUBBLE_GAP} from './demo-tour-geometry';

describe('padTourRect()', () => {
  describe('General cases', () => {
    it('네 방향으로 padding만큼 넓힌 사각형을 반환해야 한다', () => {
      expect(padTourRect(RECT, PADDING)).toEqual({x: 6, y: 16, width: 108, height: 58});
    });
  });
});

describe('getSpotlightPath()', () => {
  describe('General cases', () => {
    it('구멍이 있으면 화면 전체에서 모서리가 둥근 구멍을 뚫은 경로를 반환해야 한다', () => {
      expect(getSpotlightPath(WINDOW, RECT)).toBe(
        'M0 0H400V800H0ZM14 20H106A4 4 0 0 1 110 24V66A4 4 0 0 1 106 70H14A4 4 0 0 1 10 66V24A4 4 0 0 1 14 20Z',
      );
    });
  });

  describe('Edge cases', () => {
    it('구멍이 없으면 화면 전체를 덮는 경로만 반환해야 한다', () => {
      expect(getSpotlightPath(WINDOW, null)).toBe('M0 0H400V800H0Z');
    });
  });
});

describe('getTourBubblePosition()', () => {
  describe('General cases', () => {
    it('말풍선을 구멍의 가로 가운데에 맞춰 놓아야 한다', () => {
      const {left} = getTourBubblePosition(PARAMS);

      expect(left).toBe(HOLE.x + HOLE.width / 2 - BUBBLE.width / 2);
    });

    describe('auto일 때', () => {
      it('구멍 아래에 자리가 있으면 구멍 아래에 놓아야 한다', () => {
        const {top} = getTourBubblePosition({...PARAMS, placement: 'auto'});

        expect(top).toBe(HOLE.y + HOLE.height + TOUR_BUBBLE_GAP);
      });

      it('구멍 아래에 자리가 없으면 구멍 위에 놓아야 한다', () => {
        const hole = {...HOLE, y: 700};

        const {top} = getTourBubblePosition({...PARAMS, hole, placement: 'auto'});

        expect(top).toBe(hole.y - TOUR_BUBBLE_GAP - BUBBLE.height);
      });
    });

    describe('top일 때', () => {
      it('구멍 위에 자리가 없으면 구멍 아래에 놓아야 한다', () => {
        const hole = {...HOLE, y: 40};

        const {top} = getTourBubblePosition({...PARAMS, hole, placement: 'top'});

        expect(top).toBe(hole.y + hole.height + TOUR_BUBBLE_GAP);
      });

      describe('구멍 위에 자리가 있으면', () => {
        it('구멍 아래에 자리가 있어도 구멍 위에 놓아야 한다', () => {
          const {top} = getTourBubblePosition({...PARAMS, placement: 'top'});

          expect(top).toBe(HOLE.y - TOUR_BUBBLE_GAP - BUBBLE.height);
        });
      });
    });
  });

  describe('Boundary cases', () => {
    it('구멍이 화면 왼쪽 끝에 붙어 있으면 말풍선을 왼쪽 끝에서 10 떨어뜨려 놓아야 한다', () => {
      const {left} = getTourBubblePosition({...PARAMS, hole: {...HOLE, x: 0, width: 20}});

      expect(left).toBe(EDGE_MARGIN);
    });

    it('구멍이 화면 오른쪽 끝에 붙어 있으면 말풍선을 오른쪽 끝에서 10 떨어뜨려 놓아야 한다', () => {
      const {left} = getTourBubblePosition({...PARAMS, hole: {...HOLE, x: 380, width: 20}});

      expect(left).toBe(WINDOW.width - BUBBLE.width - EDGE_MARGIN);
    });

    describe('auto일 때', () => {
      it('구멍 위아래 어디에도 자리가 없으면 화면 아래 끝에서 10 떨어뜨려 놓아야 한다', () => {
        const {top} = getTourBubblePosition({...PARAMS, hole: {...HOLE, y: 40, height: 720}});

        expect(top).toBe(WINDOW.height - BUBBLE.height - EDGE_MARGIN);
      });

      it('말풍선 아래로 화면 끝까지 20이 남으면 구멍 아래에 놓아야 한다', () => {
        const below = WINDOW.height - FLIP_MARGIN - BUBBLE.height;
        const hole = {...HOLE, y: below - TOUR_BUBBLE_GAP - HOLE.height};

        const {top} = getTourBubblePosition({...PARAMS, hole});

        expect(top).toBe(below);
      });

      it('말풍선 아래로 화면 끝까지 19만 남으면 구멍 위에 놓아야 한다', () => {
        const hole = {
          ...HOLE,
          y: WINDOW.height - FLIP_MARGIN - BUBBLE.height - TOUR_BUBBLE_GAP - HOLE.height + 1,
        };

        const {top} = getTourBubblePosition({...PARAMS, hole});

        expect(top).toBe(hole.y - TOUR_BUBBLE_GAP - BUBBLE.height);
      });
    });

    describe('top일 때', () => {
      it('구멍 위아래 어디에도 자리가 없으면 화면 위 끝에서 10 떨어뜨려 놓아야 한다', () => {
        const {top} = getTourBubblePosition({...PARAMS, hole: {...HOLE, y: 40, height: 720}, placement: 'top'});

        expect(top).toBe(EDGE_MARGIN);
      });

      it('말풍선 위로 화면 끝까지 20이 남으면 구멍 위에 놓아야 한다', () => {
        const hole = {...HOLE, y: FLIP_MARGIN + BUBBLE.height + TOUR_BUBBLE_GAP};

        const {top} = getTourBubblePosition({...PARAMS, hole, placement: 'top'});

        expect(top).toBe(FLIP_MARGIN);
      });

      it('말풍선 위로 화면 끝까지 19만 남으면 구멍 아래에 놓아야 한다', () => {
        const hole = {...HOLE, y: FLIP_MARGIN + BUBBLE.height + TOUR_BUBBLE_GAP - 1};

        const {top} = getTourBubblePosition({...PARAMS, hole, placement: 'top'});

        expect(top).toBe(hole.y + hole.height + TOUR_BUBBLE_GAP);
      });
    });
  });
});

const RECT = {x: 10, y: 20, width: 100, height: 50};
const PADDING = 4;
const WINDOW = {width: 400, height: 800};
const HOLE = {x: 100, y: 300, width: 200, height: 100};
const BUBBLE = {width: 300, height: 120};
const PARAMS = {windowSize: WINDOW, hole: HOLE, bubbleSize: BUBBLE, placement: 'auto'} as const;
const EDGE_MARGIN = 10;
const FLIP_MARGIN = 20;
