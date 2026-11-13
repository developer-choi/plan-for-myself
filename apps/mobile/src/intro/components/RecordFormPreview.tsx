import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {formatDateTitle} from '@plan-for-myself/shared/date';
import {getRecordFormDefaultValues, type RecordFormValues} from '@plan-for-myself/shared/study-record';
import {INTRO_FORM_RECORD} from '@plan-for-myself/shared/intro';
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
