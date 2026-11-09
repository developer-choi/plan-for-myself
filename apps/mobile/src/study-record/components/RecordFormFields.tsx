import type {Ref} from 'react';
import {Pressable, StyleSheet, TextInput, type TextInputProps, View} from 'react-native';
import {
  colors,
  getMinutesError,
  MINUTE_SLOTS,
  type MinuteSlot,
  RECORD_FORM_LABELS,
  type RecordFormValues,
  validateMinuteInput,
} from '@plan-for-myself/shared';
import {useFailTagInput} from '@plan-for-myself/shared/react';
import {Lucide} from '@react-native-vector-icons/lucide';
import {Controller, useController, useFormContext} from 'react-hook-form';
import IconButton from '@/shared/components/IconButton';
import Text from '@/shared/components/Text';
import {controlHeight, fontFamily, radius, spacing, touchTarget, typography} from '@/shared/styles/design-tokens';

interface MinuteFieldProps {
  slot: MinuteSlot;
  label: string;
}

interface FormTextInputProps extends TextInputProps {
  ref?: Ref<TextInput>;
  suffix?: string;
  isInvalid?: boolean;
}

export default function RecordFormFields() {
  const {
    formState: {errors},
  } = useFormContext<RecordFormValues>();
  const minutesError = getMinutesError(errors);

  return (
    <View style={styles.fields}>
      <View>
        <Text style={styles.sectionLabel}>{RECORD_FORM_LABELS.dateType}</Text>
        <HolidayRadio />
      </View>

      <FailTagInput />

      <View>
        <Text style={styles.sectionLabel}>{RECORD_FORM_LABELS.minutes}</Text>
        <View style={styles.minutes}>
          {MINUTE_SLOTS.map(({slot, label}) => (
            <MinuteField key={slot} label={label} slot={slot} />
          ))}
        </View>
        {minutesError && <Text style={[styles.error, styles.errorGap]}>{minutesError}</Text>}
      </View>
    </View>
  );
}

const HOLIDAY_OPTIONS = [
  {holiday: false, label: RECORD_FORM_LABELS.weekday},
  {holiday: true, label: RECORD_FORM_LABELS.holiday},
];

const CHIP_PADDING_X = 6;

const CHIP_REMOVE_ICON_SIZE = 14;

const RADIO_SIZE = 13;

const RADIO_DOT_SIZE = 7;

const RADIO_HIT_SLOP = Math.max(0, (touchTarget.min - typography.body2.lineHeight) / 2);

const styles = StyleSheet.create({
  fields: {
    rowGap: spacing.formGap,
  },
  sectionLabel: {
    ...typography.body2,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.xs,
  },
  radio: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: RADIO_SIZE / 2,
  },
  radioChecked: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: RADIO_DOT_SIZE,
    height: RADIO_DOT_SIZE,
    borderRadius: RADIO_DOT_SIZE / 2,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    ...typography.body2,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.xs,
    maxWidth: '100%',
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: CHIP_PADDING_X,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.full,
    backgroundColor: colors.failSoft,
  },
  chipText: {
    ...typography.body3,
    flexShrink: 1,
    fontWeight: '500',
    color: colors.fail,
  },
  chipRemove: {
    margin: -spacing.xs,
  },
  minutes: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  minuteField: {
    flex: 1,
    minWidth: 0,
  },
  fieldLabel: {
    ...typography.body3,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  inputBase: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.xs,
    height: controlHeight.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  inputInvalid: {
    borderColor: colors.fail,
  },
  input: {
    ...typography.body2,
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontFamily,
    color: colors.text,
  },
  inputDisabled: {
    color: colors.textMuted,
  },
  suffix: {
    ...typography.body2,
    flexShrink: 0,
    color: colors.text,
  },
  error: {
    ...typography.body3,
    color: colors.fail,
  },
  errorGap: {
    marginTop: spacing.xs,
  },
});

function HolidayRadio() {
  const {control} = useFormContext<RecordFormValues>();

  return (
    <Controller
      control={control}
      name="holiday"
      render={({field}) => (
        <View style={styles.radioGroup}>
          {HOLIDAY_OPTIONS.map(({holiday, label}) => {
            const checked = field.value === holiday;
            return (
              <Pressable
                key={label}
                hitSlop={RADIO_HIT_SLOP}
                style={styles.radioOption}
                onPress={() => field.onChange(holiday)}
              >
                <View style={[styles.radio, checked && styles.radioChecked]}>
                  {checked && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    />
  );
}

function FailTagInput() {
  const {control} = useFormContext<RecordFormValues>();
  const {
    field: {ref: failTagInputRef, value: failTagInput, onBlur: onFailTagInputBlur, onChange: onFailTagInputChange},
  } = useController({control, name: 'failTagInput'});
  const {
    failTags,
    isFull,
    placeholder,
    errorMessage,
    handlers: {clearError, addFailTagInput, removeFailTag},
  } = useFailTagInput();

  const changeFailTagInput = (text: string) => {
    clearError();
    onFailTagInputChange(text);
  };

  return (
    <View>
      <Text style={styles.sectionLabel}>{RECORD_FORM_LABELS.failTags}</Text>
      <FormTextInput
        ref={failTagInputRef}
        autoComplete="off"
        editable={!isFull}
        isInvalid={errorMessage !== undefined}
        placeholder={placeholder}
        returnKeyType="done"
        submitBehavior="submit"
        value={failTagInput}
        onBlur={onFailTagInputBlur}
        onChangeText={changeFailTagInput}
        onSubmitEditing={addFailTagInput}
      />
      {errorMessage && <Text style={[styles.error, styles.errorGap]}>{errorMessage}</Text>}
      {failTags.length > 0 && (
        <View style={styles.chips}>
          {failTags.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text numberOfLines={1} style={styles.chipText}>
                {tag}
              </Text>
              <IconButton
                icon={<Lucide color={colors.fail} name="x" size={CHIP_REMOVE_ICON_SIZE} />}
                style={styles.chipRemove}
                testID={`${tag} 지우기`}
                onPress={() => removeFailTag(tag)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function MinuteField({slot, label}: MinuteFieldProps) {
  const {control} = useFormContext<RecordFormValues>();

  return (
    <Controller
      control={control}
      name={`minutes.${slot}`}
      render={({field}) => (
        <View style={styles.minuteField}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <FormTextInput
            ref={field.ref}
            keyboardType="number-pad"
            placeholder={RECORD_FORM_LABELS.minutePlaceholder}
            suffix={RECORD_FORM_LABELS.minuteSuffix}
            testID={`${label} ${RECORD_FORM_LABELS.minuteSuffix}`}
            value={field.value}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
          />
        </View>
      )}
      rules={{validate: validateMinuteInput}}
    />
  );
}

function FormTextInput({suffix, isInvalid = false, editable = true, ...props}: FormTextInputProps) {
  return (
    <View style={[styles.inputBase, isInvalid && styles.inputInvalid]}>
      <TextInput
        {...props}
        editable={editable}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, !editable && styles.inputDisabled]}
      />
      {suffix && <Text style={styles.suffix}>{suffix}</Text>}
    </View>
  );
}
