export type SpecialKey = 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey';
const SPECIAL_KEYS: SpecialKey[] = ['shiftKey', 'metaKey', 'ctrlKey', 'altKey'];

export interface KeyboardShortcut {
  key: string;
  specialKeys?: SpecialKey[];
}

export function isMatchKeyboardEvent(event: Pick<KeyboardEvent, 'key' | SpecialKey>, shortcut: KeyboardShortcut): boolean {
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false;
  }

  return isMatchingSpecialKeys(event, shortcut.specialKeys ?? []);
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/

function isMatchingSpecialKeys(event: Record<SpecialKey, boolean>, specialKeys: SpecialKey[]): boolean {
  const remainingKeys = SPECIAL_KEYS.filter(key => !specialKeys.includes(key));
  return specialKeys.every(key => event[key]) && remainingKeys.every(key => !event[key]);
}
