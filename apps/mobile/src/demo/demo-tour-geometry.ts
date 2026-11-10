export interface TourSize {
  width: number;
  height: number;
}

export interface TourRect extends TourSize {
  x: number;
  y: number;
}

export type TourBubblePlacement = 'auto' | 'top';

interface TourBubblePositionParams {
  windowSize: TourSize;
  hole: TourRect;
  bubbleSize: TourSize;
  placement: TourBubblePlacement;
}

export const TOUR_SPOTLIGHT_PADDING = 10;
export const TOUR_BUBBLE_GAP = 10;

export function padTourRect(rect: TourRect, padding: number): TourRect {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

export function getSpotlightPath(windowSize: TourSize, hole: TourRect | null): string {
  const windowPath = `M0 0H${windowSize.width}V${windowSize.height}H0Z`;

  if (hole === null) {
    return windowPath;
  }

  const {x, y, width, height} = hole;
  const corner = (endX: number, endY: number) =>
    `A${TOUR_SPOTLIGHT_RADIUS} ${TOUR_SPOTLIGHT_RADIUS} 0 0 1 ${endX} ${endY}`;
  const holePath = [
    `M${x + TOUR_SPOTLIGHT_RADIUS} ${y}`,
    `H${x + width - TOUR_SPOTLIGHT_RADIUS}`,
    corner(x + width, y + TOUR_SPOTLIGHT_RADIUS),
    `V${y + height - TOUR_SPOTLIGHT_RADIUS}`,
    corner(x + width - TOUR_SPOTLIGHT_RADIUS, y + height),
    `H${x + TOUR_SPOTLIGHT_RADIUS}`,
    corner(x, y + height - TOUR_SPOTLIGHT_RADIUS),
    `V${y + TOUR_SPOTLIGHT_RADIUS}`,
    corner(x + TOUR_SPOTLIGHT_RADIUS, y),
    'Z',
  ].join('');

  return `${windowPath}${holePath}`;
}

export function getTourBubblePosition({windowSize, hole, bubbleSize, placement}: TourBubblePositionParams): {
  left: number;
  top: number;
} {
  const centeredLeft = hole.x + hole.width / 2 - bubbleSize.width / 2;
  const below = hole.y + hole.height + TOUR_BUBBLE_GAP;
  const above = hole.y - TOUR_BUBBLE_GAP - bubbleSize.height;
  const [preferredTop, fallbackTop] = placement === 'top' ? [above, below] : [below, above];
  const fittingTop = [preferredTop, fallbackTop].find(
    (top) => top >= TOUR_BUBBLE_FLIP_MARGIN && top + bubbleSize.height <= windowSize.height - TOUR_BUBBLE_FLIP_MARGIN,
  );

  return {
    left: pushIntoWindow(centeredLeft, windowSize.width, bubbleSize.width),
    top: fittingTop ?? pushIntoWindow(preferredTop, windowSize.height, bubbleSize.height),
  };
}

const TOUR_SPOTLIGHT_RADIUS = 4;
const TOUR_BUBBLE_EDGE_MARGIN = 10;
const TOUR_BUBBLE_FLIP_MARGIN = 20;

function pushIntoWindow(value: number, windowLength: number, bubbleLength: number): number {
  return Math.min(Math.max(value, TOUR_BUBBLE_EDGE_MARGIN), windowLength - bubbleLength - TOUR_BUBBLE_EDGE_MARGIN);
}
