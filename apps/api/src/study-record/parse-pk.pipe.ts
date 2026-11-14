import {Injectable, NotFoundException, type PipeTransform} from '@nestjs/common';
import {parsePk} from '@plan-for-myself/shared/study-record';
import {RECORD_NOT_FOUND} from './study-record.errors';

@Injectable()
export class ParsePkPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const pk = parsePk(value);
    if (pk === null) {
      throw new NotFoundException(RECORD_NOT_FOUND);
    }
    return pk;
  }
}
