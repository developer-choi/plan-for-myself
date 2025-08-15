import {useEffect} from 'react';

export type SpecialKey = 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey';
const SPECIAL_KEYS: SpecialKey[] = ['shiftKey', 'metaKey', 'ctrlKey', 'altKey'];

export interface KeyboardShortcut {
  key: string;
  specialKeys?: SpecialKey[];
}

/**
 * Checks if a given keyboard event matches the specified keyboard shortcut.
 *
 * @param event - The keyboard event, compatible with both React.KeyboardEvent and window.addEventListener's KeyboardEvent.
 * @param shortcut - The target key and special key combination to match against the event.
 * @returns True if the event matches the specified key and special key combination, false otherwise.
 * @example (event, {key: 'A', specialKeys: ['ctrlKey']}) ==> Returns true if the user presses 'A' while holding the Control key (and not any other special keys like alt, meta, or shift).
 * @example (event, {key: 'Delete'}) ==> Returns true if the user presses the 'Delete' key without holding any special keys.
 */
export function isMatchKeyboardShortcut(event: Pick<KeyboardEvent, 'key' | SpecialKey>, shortcut: KeyboardShortcut): boolean {
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false;
  }

  return isMatchingSpecialKeys(event, shortcut.specialKeys ?? []);
}

/**
 * Custom hook to handle keyboard events matching a specific keyboard shortcut.
 *
 * @param keyboardShortcut - The target key and special key combination to match against the keyboard event.
 * @param callback - The function to be called when the keyboard event matches the specified shortcut.
 */
export function useKeyboardShortcut(keyboardShortcut: KeyboardShortcut, callback: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMatchKeyboardShortcut(event, keyboardShortcut)) {
        return;
      }

      callback(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, keyboardShortcut]);
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/

/**
 * Checks if the special keys in a given keyboard event match the specified special key combination.
 *
 * @param event - An object representing the state of special keys (ctrlKey, altKey, metaKey, shiftKey).
 * @param specialKeys - The list of special keys that should be pressed.
 * @returns True if the specified special keys are pressed and no other special keys are pressed, false otherwise.
 */
function isMatchingSpecialKeys(event: Record<SpecialKey, boolean>, specialKeys: SpecialKey[]): boolean {
  const remainingKeys = SPECIAL_KEYS.filter(key => !specialKeys.includes(key));
  return specialKeys.every(key => event[key]) && remainingKeys.every(key => !event[key]);
}

/**
 * Checks if a key with a character (not a special key) is pressed while the focus is on the document body.
 * For example, checks if a key like 'a' (with length 1) is pressed, excluding special keys like Ctrl or Insert.
 *
 * @param event - The KeyboardEvent triggered by a key press.
 * @returns True if a non-special key with a character length of 1 is pressed while the focus is on the document body, false otherwise.
 */
export function isCharacterKeyPressed(event: KeyboardEvent): boolean {
  const {activeElement, body} = document;

  if (activeElement !== body) {
    return false;
  }

  const {key, ctrlKey, altKey, metaKey, shiftKey} = event;

  if (ctrlKey || altKey || metaKey || shiftKey) {
    return false;
  }

  /**
   * 'Enter', 'ArrowUp' 같은 특수키는 꼭 길이가 1보다 컸고, 'ㅁ'같은 한글은 포커스가 document.body에 있을 때 입력할 경우 'a'로 입력이 됬었음.
   * 그러므로 길이가 1인걸로 체크하는것으로 결정했습니다.
   */
  return key.length === 1;
}
