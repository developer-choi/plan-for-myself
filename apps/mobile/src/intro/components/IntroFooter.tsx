import {openURL} from 'expo-linking';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {GITHUB_REPOSITORY_URL, INTRO_TEXT, MAKER_URL} from '@plan-for-myself/shared/intro';
import {PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared/label';
import Text from '@/shared/components/Text';
import {PRIVACY_POLICY_URL} from '@/shared/external-link';
import {opacity, spacing, touchTarget, typography} from '@/shared/styles/design-tokens';

interface FooterLinkProps {
  label: string;
  url: string;
}

export default function IntroFooter() {
  return (
    <View style={styles.footer}>
      <FooterLink label={PRIVACY_POLICY_LABEL} url={PRIVACY_POLICY_URL} />
      <Text style={styles.text}>·</Text>
      <FooterLink label={INTRO_TEXT.githubLabel} url={GITHUB_REPOSITORY_URL} />
      <Text style={styles.text}>·</Text>
      <FooterLink label={INTRO_TEXT.makerLabel} url={MAKER_URL} />
    </View>
  );
}

const LINK_VERTICAL_SLOP = (touchTarget.min - typography.body3.lineHeight) / 2;
const LINK_HIT_SLOP = {top: LINK_VERTICAL_SLOP, bottom: LINK_VERTICAL_SLOP};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.pageXMobile,
    paddingBottom: spacing.xl,
  },
  text: {
    ...typography.body3,
    color: colors.textMuted,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});

function FooterLink({label, url}: FooterLinkProps) {
  return (
    <Pressable
      hitSlop={LINK_HIT_SLOP}
      style={({pressed}) => pressed && styles.pressed}
      onPress={() => void openURL(url)}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}
