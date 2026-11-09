import {getRecordFormDefaultValues, type RecordFormValues, STUDY_RECORD_FIELD_MESSAGES} from '@plan-for-myself/shared';
import {describe, expect, it} from '@jest/globals';
import {render, screen, userEvent} from '@testing-library/react-native';
import {FormProvider, useForm} from 'react-hook-form';
import RecordFormFields from './RecordFormFields';

interface FieldsWithFormProps {
  failTags?: string[];
}

describe('RecordFormFields', () => {
  describe('General cases', () => {
    describe('태그를 입력하고 완료 키를 누르면', () => {
      it('칩이 생겨야 한다', async () => {
        const user = userEvent.setup();
        await render(<FieldsWithForm />);

        await user.type(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER), OVERSLEPT, {submitEditing: true});

        expect(screen.getByText(OVERSLEPT)).toBeOnTheScreen();
      });

      it('태그 칸이 비어야 한다', async () => {
        const user = userEvent.setup();
        await render(<FieldsWithForm />);

        await user.type(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER), OVERSLEPT, {submitEditing: true});

        expect(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER)).toHaveDisplayValue('');
      });
    });

    it('칩의 지우기를 누르면 그 칩이 사라져야 한다', async () => {
      const user = userEvent.setup();
      await render(<FieldsWithForm failTags={[OVERSLEPT]} />);

      await user.press(screen.getByTestId(`${OVERSLEPT} 지우기`));

      expect(screen.queryByText(OVERSLEPT)).not.toBeOnTheScreen();
    });
  });

  describe('Boundary cases', () => {
    describe('태그가 최대보다 하나 적으면', () => {
      it('태그 칸이 열려 있어야 한다', async () => {
        await render(<FieldsWithForm failTags={[OVERSLEPT]} />);

        expect(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER)).toBeEnabled();
      });
    });

    describe('태그가 최대 개수만큼 있으면', () => {
      it('태그 칸이 막혀야 한다', async () => {
        await render(<FieldsWithForm failTags={[OVERSLEPT, GAME]} />);

        expect(screen.getByPlaceholderText(FULL_PLACEHOLDER)).toBeDisabled();
      });
    });

    it('최대 개수에서 칩 하나를 지우면 칸이 다시 열려야 한다', async () => {
      const user = userEvent.setup();
      await render(<FieldsWithForm failTags={[OVERSLEPT, GAME]} />);

      await user.press(screen.getByTestId(`${GAME} 지우기`));

      expect(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER)).toBeEnabled();
    });
  });

  describe('Edge cases', () => {
    describe('글자 수를 넘는 태그로 완료 키를 누르면', () => {
      it('글자 수 제한 안내가 보여야 한다', async () => {
        const user = userEvent.setup();
        await render(<FieldsWithForm />);

        await user.type(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER), TOO_LONG_TAG, {submitEditing: true});

        expect(screen.getByText(STUDY_RECORD_FIELD_MESSAGES.failTagLength)).toBeOnTheScreen();
      });

      it('칩이 생기지 않아야 한다', async () => {
        const user = userEvent.setup();
        await render(<FieldsWithForm />);

        await user.type(screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER), TOO_LONG_TAG, {submitEditing: true});

        expect(screen.queryByText(TOO_LONG_TAG)).not.toBeOnTheScreen();
      });
    });

    it('글자 수 제한 안내가 뜬 뒤 태그 칸에 입력하면 안내가 사라져야 한다', async () => {
      const user = userEvent.setup();
      await render(<FieldsWithForm />);
      const input = screen.getByPlaceholderText(FAIL_TAG_PLACEHOLDER);
      await user.type(input, TOO_LONG_TAG, {submitEditing: true});

      await user.type(input, ONE_LETTER);

      expect(screen.queryByText(STUDY_RECORD_FIELD_MESSAGES.failTagLength)).not.toBeOnTheScreen();
    });
  });
});

const DATE = '2026-10-21';

const OVERSLEPT = '늦잠';

const GAME = '게임';

const TOO_LONG_TAG = '가나다라마바사';

const ONE_LETTER = '아';

const FAIL_TAG_PLACEHOLDER = '단어 하나 입력 후 Enter';

const FULL_PLACEHOLDER = '최대 2개까지';

function FieldsWithForm({failTags = []}: FieldsWithFormProps) {
  const methods = useForm<RecordFormValues>({defaultValues: {...getRecordFormDefaultValues(DATE), failTags}});

  return (
    <FormProvider {...methods}>
      <RecordFormFields />
    </FormProvider>
  );
}
