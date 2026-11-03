import {useState} from 'react';
import Text from '@/shared/components/Text';
import {describe, expect, it} from '@jest/globals';
import {fireEvent, render, screen, userEvent} from '@testing-library/react-native';
import HeaderMenu, {MENU_BUTTON_TEST_ID, MENU_MODAL_TEST_ID} from './HeaderMenu';

describe('HeaderMenu', () => {
  describe('General cases', () => {
    it('메뉴 버튼을 누르기 전에는 메뉴 항목이 없어야 한다', async () => {
      await render(<MenuWithResult />);

      expect(screen.queryByText(ITEM_LABEL)).not.toBeOnTheScreen();
    });

    it('메뉴 버튼을 누르면 메뉴 항목이 있어야 한다', async () => {
      const user = userEvent.setup();
      await render(<MenuWithResult />);

      await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

      expect(screen.getByText(ITEM_LABEL)).toBeOnTheScreen();
    });

    it('항목을 누르면 그 항목의 동작을 실행해야 한다', async () => {
      const user = userEvent.setup();
      await render(<MenuWithResult />);
      await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

      await user.press(screen.getByText(ITEM_LABEL));

      expect(screen.getByText(ITEM_RESULT)).toBeOnTheScreen();
    });

    it('항목을 누르면 메뉴를 닫아야 한다', async () => {
      const user = userEvent.setup();
      await render(<MenuWithResult />);
      await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

      await user.press(screen.getByText(ITEM_LABEL));

      expect(screen.queryByText(ITEM_LABEL)).not.toBeOnTheScreen();
    });

    it('안드로이드 뒤로 가기를 누르면 메뉴를 닫아야 한다', async () => {
      const user = userEvent.setup();
      await render(<MenuWithResult />);
      await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

      await fireEvent(screen.getByTestId(MENU_MODAL_TEST_ID), 'requestClose');

      expect(screen.queryByText(ITEM_LABEL)).not.toBeOnTheScreen();
    });
  });
});

const ITEM_LABEL = '로그아웃';
const ITEM_RESULT = '로그아웃을 눌렀다';

function MenuWithResult() {
  const [result, setResult] = useState('');

  return (
    <>
      <HeaderMenu items={[{label: ITEM_LABEL, onPress: () => setResult(ITEM_RESULT)}]} />
      <Text>{result}</Text>
    </>
  );
}
