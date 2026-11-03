import {type ComponentProps} from 'react';
import {Lucide} from '@react-native-vector-icons/lucide';
import IconButton, {ICON_COLOR} from '@/shared/components/IconButton';

type CloseIconButtonProps = Pick<ComponentProps<typeof IconButton>, 'style' | 'onPress'>;

export default function CloseIconButton(props: CloseIconButtonProps) {
  return (
    <IconButton
      icon={<Lucide color={ICON_COLOR} name="x" size={ICON_SIZE} />}
      testID={CLOSE_ICON_BUTTON_TEST_ID}
      {...props}
    />
  );
}

export const CLOSE_ICON_BUTTON_TEST_ID = '닫기';

const ICON_SIZE = 15;
