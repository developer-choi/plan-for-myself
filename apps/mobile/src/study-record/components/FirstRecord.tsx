import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {FIRST_RECORD_TEXT} from '@plan-for-myself/shared/study-record';
import {toDateMonthParam} from '@plan-for-myself/shared/date';
import {openOnce} from '@plan-for-myself/shared/overlay';
import {Lucide} from '@react-native-vector-icons/lucide';
import Button from '@/shared/components/Button';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';
import RecordFormDialog from '@/study-record/components/RecordFormDialog';

interface FirstRecordProps {
  today: string;
}

export default function FirstRecord({today}: FirstRecordProps) {
  const openTodayRecordForm = () => {
    openOnce('record-form', ({isOpen, unmount}) => (
      <RecordFormDialog date={today} isOpen={isOpen} month={toDateMonthParam(today)} onClose={unmount} />
    ));
  };

  return (
    <View style={styles.firstRecord}>
      <Logo size="large" />
      <View style={styles.text}>
        <Text style={styles.title}>{FIRST_RECORD_TEXT.title}</Text>
        <Text style={styles.description}>{FIRST_RECORD_TEXT.description}</Text>
      </View>
      <Button
        icon={<Lucide color={colors.onPrimary} name="plus" size={PLUS_ICON_SIZE} />}
        label={FIRST_RECORD_TEXT.action}
        onPress={openTodayRecordForm}
      />
    </View>
  );
}

const PLUS_ICON_SIZE = 15;

const styles = StyleSheet.create({
  firstRecord: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  text: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
