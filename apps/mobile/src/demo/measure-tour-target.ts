import type {RefObject} from 'react';
import type {MeasureInWindowOnSuccessCallback, View} from 'react-native';
import type {TourRect} from '@/demo/demo-tour-geometry';

export function measureTourTarget(
  targetRef: RefObject<View | null>,
  onDone: (rect: TourRect | null) => void,
): () => void {
  let isStopped = false;
  let frameId: number;
  let previousRect: TourRect | null = null;
  let stableSince = 0;
  let stableFrameCount = 0;

  const stop = () => {
    isStopped = true;
    clearTimeout(timeoutId);
    cancelAnimationFrame(frameId);
  };
  const finish = (rect: TourRect | null) => {
    stop();
    onDone(rect);
  };
  const compareWithPrevious: MeasureInWindowOnSuccessCallback = (...[left, top, width, height]) => {
    if (isStopped) {
      return;
    }

    const rect = {x: left, y: top, width, height};

    if (previousRect === null || width === 0 || !isSameRect(previousRect, rect)) {
      stableSince = Date.now();
      stableFrameCount = 0;
    } else {
      stableFrameCount += 1;

      /* 시간만 보면 JS가 멈춘 동안에도 시간이 흘러 스크롤 전 위치를 멈춘 것으로 친다. 프레임 수도 함께 본다 */
      if (stableFrameCount >= STABLE_FRAME_COUNT && Date.now() - stableSince >= STABLE_DURATION_MS) {
        finish(rect);
        return;
      }
    }

    previousRect = rect;
    measureOnNextFrame();
  };
  const measureOnNextFrame = () => {
    frameId = requestAnimationFrame(() => {
      if (targetRef.current) {
        targetRef.current.measureInWindow(compareWithPrevious);
      } else {
        measureOnNextFrame();
      }
    });
  };
  const timeoutId = setTimeout(() => finish(null), MEASURE_TIMEOUT_MS);

  measureOnNextFrame();

  return stop;
}

const MEASURE_TIMEOUT_MS = 1000;
const STABLE_DURATION_MS = 150;
const STABLE_FRAME_COUNT = 9;

function isSameRect(first: TourRect, second: TourRect): boolean {
  return first.x === second.x && first.y === second.y && first.width === second.width && first.height === second.height;
}
