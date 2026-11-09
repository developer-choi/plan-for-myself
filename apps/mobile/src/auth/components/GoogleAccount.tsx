import {StyleSheet} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {GOOGLE_ACCOUNT_TITLE, GOOGLE_DELETE_TEXT} from '@plan-for-myself/shared/auth';
import AccountDeleteAction from '@/auth/components/AccountDeleteAction';
import Card from '@/shared/components/Card';
import Text from '@/shared/components/Text';
import {typography} from '@/shared/styles/design-tokens';

export default function GoogleAccount() {
  return (
    <>
      <Card>
        <Text style={styles.title}>{GOOGLE_ACCOUNT_TITLE}</Text>
      </Card>
      <AccountDeleteAction text={GOOGLE_DELETE_TEXT} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text,
  },
});
