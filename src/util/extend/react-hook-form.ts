import type {FieldError} from 'react-hook-form/dist/types/errors';

export function baseHandleErrors<T>(errorList: (FieldError | undefined)[], customFocus = false) {
  for (const error of errorList) {
    if (!error) {
      continue;
    }

    const {message} = error;

    if (!message) {
      throw new TypeError('error message를 지정안했음. register중에 ValidationValueMessage 타입으로 쓰지않은 값이 있는지 확인');
    }

    alert(message);

    if (customFocus) {
      error.ref?.focus?.();
    }

    break;
  }
}
