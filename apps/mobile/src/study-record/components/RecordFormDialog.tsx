import {KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {formatDateTitle} from '@plan-for-myself/shared/date';
import {RECORD_FORM_LABELS, type StudyRecord} from '@plan-for-myself/shared/study-record';
import {useRecordForm} from '@plan-for-myself/shared/study-record/react';
import {captureException} from '@sentry/react-native';
import {FormProvider} from 'react-hook-form';
import Button from '@/shared/components/Button';
import CloseIconButton from '@/shared/components/CloseIconButton';
import Text from '@/shared/components/Text';
import {contentWidth, radius, shadows, spacing, typography} from '@/shared/styles/design-tokens';
import {studyRecordApi} from '@/study-record/api';
import RecordFormFields from '@/study-record/components/RecordFormFields';

interface RecordFormDialogProps {
  isOpen: boolean;
  date: string;
  month: string;
  /** 그날 기록이 없으면 undefined — [삭제] 버튼이 없고 새 기록을 만든다 */
  record?: StudyRecord;
  onClose: () => void;
}

export default function RecordFormDialog({isOpen, date, month, record, onClose}: RecordFormDialogProps) {
  const {methods, form} = useRecordForm({
    target: {date, month, record},
    onClose,
    dependencies: {api: studyRecordApi, reportUnexpectedError: captureException},
  });

  return (
    <Modal
      navigationBarTranslucent
      statusBarTranslucent
      transparent
      animationType="none"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} />
      <KeyboardAvoidingView behavior="padding" pointerEvents="box-none" style={styles.keyboardAvoider}>
        <View pointerEvents="box-none" style={styles.center}>
          <View style={styles.paper}>
            <View style={styles.header}>
              <Text style={styles.title}>{formatDateTitle(date)}</Text>
              <CloseIconButton onPress={onClose} />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <FormProvider {...methods}>
                <RecordFormFields />
              </FormProvider>
              {form.rejectionMessage === undefined ? null : (
                <Text style={styles.rejection}>{form.rejectionMessage}</Text>
              )}
            </ScrollView>
            <View style={styles.footer}>
              {form.handlers.onDelete === undefined ? null : (
                <Button
                  color="destructive"
                  disabled={form.saving}
                  label={RECORD_FORM_LABELS.delete}
                  loading={form.deleting}
                  style={styles.footerButton}
                  onPress={form.handlers.onDelete}
                />
              )}
              <Button
                disabled={form.deleting}
                label={RECORD_FORM_LABELS.save}
                loading={form.saving}
                style={styles.footerButton}
                onPress={() => form.handlers.onSubmit()}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
  },
  keyboardAvoider: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  paper: {
    width: '100%',
    maxWidth: contentWidth.dialog,
    maxHeight: '100%',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    boxShadow: shadows.dialog,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    flexShrink: 1,
    fontWeight: 'bold',
    color: colors.text,
  },
  rejection: {
    ...typography.body2,
    marginTop: spacing.formGap,
    padding: spacing.gridGap,
    borderRadius: radius.sm,
    overflow: 'hidden',
    color: colors.fail,
    backgroundColor: colors.failSoft,
  },
  footer: {
    flexDirection: 'row',
    columnGap: spacing.sm,
    marginTop: spacing.lg,
  },
  footerButton: {
    flex: 1,
  },
});
