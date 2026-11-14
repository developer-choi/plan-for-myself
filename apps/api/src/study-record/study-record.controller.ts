import {CurrentUser} from '@nestjs/authentication';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {getKoreanToday} from '@plan-for-myself/shared/date';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {
  checkNewStudyRecord,
  checkStudyRecordUpdate,
  monthSchema,
  type NewStudyRecord,
  newStudyRecordSchema,
  RECORD_REJECTION_CODES,
  type StudyRecordFields,
  studyRecordUpdateSchema,
} from '@plan-for-myself/shared/study-record';
import {z} from 'zod';
import {throwIfRejected} from '../error/throw-if-rejected';
import {apiErrorSchema} from '../openapi/api-error-schema';
import {STUDY_RECORD_SCHEMA} from '../openapi/study-record-schemas';
import type {UserRow} from '../user/user.repository';
import {ParsePkPipe} from './parse-pk.pipe';
import {DUPLICATE_DATE, RECORD_NOT_FOUND} from './study-record.errors';
import {StudyRecordRepository} from './study-record.repository';

const monthQuerySchema = z.object({month: monthSchema});

const ERROR_RESPONSES = {
  unauthorized: {
    description: '토큰이 없거나 틀렸거나, 탈퇴한 사용자다',
    schema: apiErrorSchema([API_ERROR_CODES.UNAUTHORIZED]),
  },
  invalidMonth: {
    description: '조회할 달이 형식에 맞지 않는다',
    schema: apiErrorSchema([API_ERROR_CODES.INVALID_MONTH]),
  },
  invalidNewRecord: {
    description: '본문이 형식에 맞지 않거나 빈 기록·미래 날짜다. code가 틀린 칸을 가리킨다',
    schema: apiErrorSchema(RECORD_REJECTION_CODES),
  },
  invalidRecordUpdate: {
    description: '본문이 형식에 맞지 않거나 빈 기록이다. 날짜를 보내면 INVALID_DATE다(날짜는 바꿀 수 없다)',
    schema: apiErrorSchema(RECORD_REJECTION_CODES),
  },
  notFound: {description: '그 pk의 내 기록이 없다', schema: apiErrorSchema([API_ERROR_CODES.NOT_FOUND])},
  duplicateDate: {description: '그 날짜에 이미 기록이 있다', schema: apiErrorSchema([API_ERROR_CODES.DUPLICATE_DATE])},
};

@ApiTags('study-records')
@ApiBearerAuth()
@ApiUnauthorizedResponse(ERROR_RESPONSES.unauthorized)
@Controller('study-records')
export class StudyRecordController {
  constructor(private readonly repository: StudyRecordRepository) {}

  @Get()
  @ApiOkResponse({description: '그 달의 내 기록(날짜 순)', schema: {type: 'array', items: STUDY_RECORD_SCHEMA}})
  @ApiBadRequestResponse(ERROR_RESPONSES.invalidMonth)
  list(@CurrentUser() user: UserRow, @Query({schema: monthQuerySchema}) query: z.output<typeof monthQuerySchema>) {
    return this.repository.list(user.id, query.month);
  }

  @Post()
  @ApiCreatedResponse({description: '추가한 기록', schema: STUDY_RECORD_SCHEMA})
  @ApiBadRequestResponse(ERROR_RESPONSES.invalidNewRecord)
  @ApiConflictResponse(ERROR_RESPONSES.duplicateDate)
  async create(@CurrentUser() user: UserRow, @Body({schema: newStudyRecordSchema}) record: NewStudyRecord) {
    throwIfRejected(checkNewStudyRecord(record, getKoreanToday()));

    const created = await this.repository.create(user.id, record);
    if (created.ok) {
      return created.record;
    }

    throw created.reason === 'USER_NOT_FOUND' ? new UnauthorizedException() : new ConflictException(DUPLICATE_DATE);
  }

  @Patch(':pk')
  @ApiOkResponse({description: '고친 기록', schema: STUDY_RECORD_SCHEMA})
  @ApiBadRequestResponse(ERROR_RESPONSES.invalidRecordUpdate)
  @ApiNotFoundResponse(ERROR_RESPONSES.notFound)
  async update(
    @CurrentUser() user: UserRow,
    @Param('pk', ParsePkPipe) pk: number,
    @Body({schema: studyRecordUpdateSchema}) fields: StudyRecordFields,
  ) {
    throwIfRejected(checkStudyRecordUpdate(fields));

    const updated = await this.repository.update({userId: user.id, pk}, fields);
    if (!updated) {
      throw new NotFoundException(RECORD_NOT_FOUND);
    }
    return updated;
  }

  @Delete(':pk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({description: '지웠다'})
  @ApiNotFoundResponse(ERROR_RESPONSES.notFound)
  async delete(@CurrentUser() user: UserRow, @Param('pk', ParsePkPipe) pk: number) {
    if (!(await this.repository.delete({userId: user.id, pk}))) {
      throw new NotFoundException(RECORD_NOT_FOUND);
    }
  }
}
