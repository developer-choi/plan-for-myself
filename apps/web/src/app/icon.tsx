import {ImageResponse} from 'next/og';
import {colors} from '@plan-for-myself/shared';
import Logo from '@/components/logo/Logo';

const ICON_SIZE = 32;

export const size = {width: ICON_SIZE, height: ICON_SIZE};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <Logo backgroundColor={colors.primary} markColor={colors.onPrimary} size={ICON_SIZE} />,
    size,
  );
}
