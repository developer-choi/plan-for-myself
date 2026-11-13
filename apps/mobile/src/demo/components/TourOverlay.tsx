import {type ReactNode, useState} from 'react';
import {type LayoutChangeEvent, Modal, StyleSheet, useWindowDimensions, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {colors} from '@plan-for-myself/shared/color';
import {
  getSpotlightPath,
  getTourBubblePosition,
  type TourBubblePlacement,
  type TourRect,
  type TourSize,
} from '@/demo/demo-tour-geometry';

interface TourOverlayProps {
  isOpen: boolean;
  hole: TourRect | null;
  placement: TourBubblePlacement;
  bubble: ReactNode;
  handlers: {
    onRequestClose: () => void;
  };
}

interface PositionedBubbleProps {
  hole: TourRect;
  placement: TourBubblePlacement;
  children: ReactNode;
}

export default function TourOverlay({isOpen, hole, placement, bubble, handlers}: TourOverlayProps) {
  const windowSize = useWindowDimensions();

  return (
    <Modal
      navigationBarTranslucent
      statusBarTranslucent
      transparent
      animationType="none"
      visible={isOpen}
      onRequestClose={handlers.onRequestClose}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Path d={getSpotlightPath(windowSize, hole)} fill={colors.backdrop} fillRule="evenodd" />
      </Svg>
      {hole && (
        <PositionedBubble hole={hole} placement={placement}>
          {bubble}
        </PositionedBubble>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
  },
  hidden: {
    opacity: 0,
  },
});

function PositionedBubble({hole, placement, children}: PositionedBubbleProps) {
  const windowSize = useWindowDimensions();
  const [bubbleSize, setBubbleSize] = useState<TourSize | null>(null);
  const positionStyle =
    bubbleSize === null ? styles.hidden : getTourBubblePosition({windowSize, hole, bubbleSize, placement});
  const storeBubbleSize = ({nativeEvent}: LayoutChangeEvent) => {
    const {width, height} = nativeEvent.layout;
    setBubbleSize({width, height});
  };

  return (
    <View style={[styles.bubble, positionStyle]} onLayout={storeBubbleSize}>
      {children}
    </View>
  );
}
