import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {colors} from '@plan-for-myself/shared';

interface LogoProps {
  size: keyof typeof LOGO_SIZE;
}

export default function Logo({size: sizeName}: LogoProps) {
  const size = LOGO_SIZE[sizeName];
  const markSize = (size * MOCKUP_MARK_SIZE) / MOCKUP_SIZE;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: (size * MOCKUP_RADIUS) / MOCKUP_SIZE,
        backgroundColor: colors.primary,
      }}
    >
      <Svg
        fill="none"
        height={markSize}
        stroke={colors.onPrimary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        viewBox="0 0 24 24"
        width={markSize}
      >
        <Path d="M6 21V4" />
        <Path d="M6 4.5c3-1.6 5.5 1.6 8.5 0s3.5-.5 3.5-.5v8.5s-.5-1.1-3.5.5-5.5-1.6-8.5 0" fill={colors.onPrimary} />
      </Svg>
    </View>
  );
}

const LOGO_SIZE = {medium: 32, large: 52} as const;

const MOCKUP_SIZE = 72;
const MOCKUP_RADIUS = 20;
const MOCKUP_MARK_SIZE = 42;
