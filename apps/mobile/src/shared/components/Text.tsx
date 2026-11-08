import {type ComponentProps} from 'react';
import {Text as NativeText, StyleSheet} from 'react-native';
import {fontFamily} from '@/shared/styles/design-tokens';

export default function Text({style, ...props}: ComponentProps<typeof NativeText>) {
  return <NativeText {...props} style={[styles.text, style]} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily,
  },
});
