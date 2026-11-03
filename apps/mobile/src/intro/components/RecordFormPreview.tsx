import {StyleSheet, View} from 'react-native';
import {
  colors,
  formatDateTitle,
  getRecordFormDefaultValues,
  INTRO_FORM_RECORD,
  type RecordFormValues,
} from '@plan-for-myself/shared';
import {FormProvider, useForm} from 'react-hook-form';
import Text from '@/shared/components/Text';
import {radius, spacing, typography} from '@/shared/styles/design-tokens';
import RecordFormFields from '@/study-record/components/RecordFormFields';

export default function RecordFormPreview() {
  const methods = useForm<RecordFormValues>({defaultValues: DEFAULT_VALUES});

  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>{formatDateTitle(INTRO_FORM_RECORD.date)}</Text>
      <FormProvider {...methods}>
        <RecordFormFields />
      </FormProvider>
    </View>
  );
}

const DEFAULT_VALUES = getRecordFormDefaultValues(INTRO_FORM_RECORD.date, INTRO_FORM_RECORD);

const styles = StyleSheet.create({
  sheet: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  title: {
    ...typography.h4,
    fontWeight: 'bold',
    color: colors.text,
  },
});
