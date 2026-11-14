import {BaseError} from '@developer-choi/utils/api';

export class ImpossibleStateError extends BaseError {
  readonly name = 'ImpossibleStateError';

  constructor(message: string) {
    super(message);
  }
}
