import {useState} from 'react';
import Text from '@/shared/components/Text';
import {describe, expect, it} from '@jest/globals';
import {render, screen, userEvent} from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  describe('General cases', () => {
    it('로딩 중에 누르면 누른 결과가 화면에 나타나지 않아야 한다', async () => {
      const user = userEvent.setup();
      await render(<ButtonWithResult loading />);

      await user.press(screen.getByText(BUTTON_LABEL));

      expect(screen.queryByText(PRESS_RESULT)).not.toBeOnTheScreen();
    });

    it('로딩 중이 아닐 때 누르면 누른 결과가 화면에 나타나야 한다', async () => {
      const user = userEvent.setup();
      await render(<ButtonWithResult />);

      await user.press(screen.getByText(BUTTON_LABEL));

      expect(screen.getByText(PRESS_RESULT)).toBeOnTheScreen();
    });

    it('막혀 있을 때 누르면 누른 결과가 화면에 나타나지 않아야 한다', async () => {
      const user = userEvent.setup();
      await render(<ButtonWithResult disabled />);

      await user.press(screen.getByText(BUTTON_LABEL));

      expect(screen.queryByText(PRESS_RESULT)).not.toBeOnTheScreen();
    });
  });
});

const BUTTON_LABEL = '시작하기';
const PRESS_RESULT = '눌렀다';

function ButtonWithResult({loading, disabled}: {loading?: boolean; disabled?: boolean}) {
  const [result, setResult] = useState('');

  return (
    <>
      <Button disabled={disabled} label={BUTTON_LABEL} loading={loading} onPress={() => setResult(PRESS_RESULT)} />
      <Text>{result}</Text>
    </>
  );
}
