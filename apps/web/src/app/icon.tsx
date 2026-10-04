import {ImageResponse} from 'next/og';
import {colors} from '@plan-for-myself/shared';
import Logo, {LOGO_SIZE} from '@/shared/components/Logo';

export const size = {width: LOGO_SIZE.medium, height: LOGO_SIZE.medium};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<Logo backgroundColor={colors.primary} markColor={colors.onPrimary} size="medium" />, size);
}
