import {useRef, useState} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {Lucide} from '@react-native-vector-icons/lucide';
import IconButton, {ICON_COLOR} from '@/shared/components/IconButton';
import Text from '@/shared/components/Text';
import {radius, shadows, spacing, typography} from '@/shared/styles/design-tokens';

interface HeaderMenuItem {
  label: string;
  onPress: () => void;
}

interface HeaderMenuProps {
  items: HeaderMenuItem[];
}

interface MenuPosition {
  top: number;
  left: number;
}

export default function HeaderMenu({items}: HeaderMenuProps) {
  const triggerRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const open = () => {
    setIsOpen(true);
    // eslint-disable-next-line max-params -- measureInWindow 콜백은 x·y·너비·높이 네 인자를 받는다
    triggerRef.current?.measureInWindow((left, top, _width, height) => {
      setPosition({top: top + height + MENU_OFFSET, left});
    });
  };

  const close = () => {
    setIsOpen(false);
    setPosition(null);
  };

  const select = (item: HeaderMenuItem) => {
    close();
    item.onPress();
  };

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <IconButton
          icon={<Lucide color={ICON_COLOR} name="menu" size={MENU_ICON_SIZE} />}
          testID={MENU_BUTTON_TEST_ID}
          onPress={open}
        />
      </View>
      <Modal
        navigationBarTranslucent
        statusBarTranslucent
        transparent
        animationType="none"
        testID={MENU_MODAL_TEST_ID}
        visible={isOpen}
        onRequestClose={close}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={[styles.menu, position ?? styles.unmeasured]}>
          {items.map((item) => (
            <Pressable
              key={item.label}
              style={({pressed}) => [styles.menuItem, pressed && styles.highlighted]}
              onPress={() => select(item)}
            >
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}

export const MENU_BUTTON_TEST_ID = 'header-menu-button';
export const MENU_MODAL_TEST_ID = 'header-menu-modal';

const MENU_ICON_SIZE = 24;
const MENU_OFFSET = 6;

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    minWidth: 180,
    padding: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    boxShadow: shadows.hover,
  },
  unmeasured: {
    opacity: 0,
  },
  menuItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  highlighted: {
    backgroundColor: colors.off,
  },
  menuItemLabel: {
    ...typography.body1,
    color: colors.text,
  },
});
