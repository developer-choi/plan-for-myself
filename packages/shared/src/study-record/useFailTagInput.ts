import {useController, useFormContext} from 'react-hook-form';
import {STUDY_RECORD_FIELD_LIMITS} from './limits';
import {addFailTag, type RecordFormValues} from './record-form';
import {RECORD_FORM_LABELS} from './record-form-labels';

export default function useFailTagInput() {
  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: {errors},
  } = useFormContext<RecordFormValues>();
  const {field: failTagsField} = useController({control, name: 'failTags'});
  const failTags = failTagsField.value;
  const isFull = failTags.length >= STUDY_RECORD_FIELD_LIMITS.failTags.maxCount;

  const clearError = () => clearErrors('failTagInput');

  const addFailTagInput = () => {
    const result = addFailTag(failTags, getValues('failTagInput'));
    if (!result.ok) {
      setError('failTagInput', {message: result.message});
      return;
    }

    clearError();
    setValue('failTagInput', '');
    failTagsField.onChange(result.failTags);
  };

  const removeFailTag = (tag: string) => {
    clearError();
    failTagsField.onChange(failTags.filter((failTag) => failTag !== tag));
  };

  return {
    failTags,
    isFull,
    placeholder: isFull ? RECORD_FORM_LABELS.fullFailTagsPlaceholder : RECORD_FORM_LABELS.failTagPlaceholder,
    /* 칸에 오류가 없으면 undefined */
    errorMessage: errors.failTagInput?.message,
    handlers: {
      clearError,
      addFailTagInput,
      removeFailTag,
    },
  };
}
