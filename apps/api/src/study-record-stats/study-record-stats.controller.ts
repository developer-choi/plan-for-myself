import {CurrentUser} from '@nestjs/authentication';
import {Controller, Get, Query} from '@nestjs/common';
import {ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {getKoreanToday} from '@plan-for-myself/shared/date';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {
  checkLookupDate,
  checkNotFutureMonth,
  dateSchema,
  FAILURE_TAG_STATUSES,
  FAILURE_TAG_TREND_STATUSES,
  monthSchema,
} from '@plan-for-myself/shared/study-record';
import {calculateMonthly, calculateOverview, toMonth} from '@plan-for-myself/shared/study-record-stats';
import {z} from 'zod';
import {throwIfRejected} from '../error/throw-if-rejected';
import {apiErrorSchema} from '../openapi/api-error-schema';
import {StudyRecordRepository} from '../study-record/study-record.repository';
import type {UserRow} from '../user/user.repository';

const overviewQuerySchema = z.object({date: dateSchema});
const monthlyQuerySchema = z.object({month: monthSchema, date: dateSchema});

const NULLABLE_NUMBER = {type: 'number', nullable: true};

const OVERVIEW_SCHEMA = {
  type: 'object',
  required: ['date', 'firstRecordDate', 'streak', 'totals'],
  properties: {
    date: {type: 'string', format: 'date'},
    firstRecordDate: {type: 'string', format: 'date', nullable: true},
    streak: {
      type: 'object',
      required: ['current', 'longest'],
      properties: {current: {type: 'integer'}, longest: {type: 'integer'}},
    },
    totals: {
      type: 'object',
      required: ['recordedDays', 'studiedMinutes'],
      properties: {recordedDays: {type: 'integer'}, studiedMinutes: {type: 'integer'}},
    },
  },
};

const MONTHLY_SCHEMA = {
  type: 'object',
  required: ['month', 'inProgress', 'recordedDays', 'study', 'failureTags'],
  properties: {
    month: {type: 'string', example: '2026-09'},
    inProgress: {type: 'boolean'},
    recordedDays: {
      type: 'object',
      required: ['count', 'total'],
      properties: {count: {type: 'integer'}, total: {type: 'integer'}},
    },
    study: {
      type: 'object',
      required: ['totalMinutes', 'weekdayAvg', 'holidayAvg', 'prevWeekdayAvg', 'prevHolidayAvg'],
      properties: {
        totalMinutes: {type: 'integer'},
        weekdayAvg: NULLABLE_NUMBER,
        holidayAvg: NULLABLE_NUMBER,
        prevWeekdayAvg: NULLABLE_NUMBER,
        prevHolidayAvg: NULLABLE_NUMBER,
      },
    },
    failureTags: {
      type: 'array',
      items: {
        type: 'object',
        required: ['tag', 'count', 'previousCount', 'status', 'trend'],
        properties: {
          tag: {type: 'string'},
          count: {type: 'integer'},
          previousCount: {type: 'integer'},
          status: {type: 'string', enum: [...FAILURE_TAG_STATUSES]},
          trend: {
            type: 'array',
            items: {
              type: 'object',
              required: ['month', 'count', 'previousCount', 'status'],
              properties: {
                month: {type: 'string'},
                count: {type: 'integer'},
                previousCount: {type: 'integer'},
                status: {type: 'string', enum: [...FAILURE_TAG_TREND_STATUSES]},
              },
            },
          },
        },
      },
    },
  },
};

const ERROR_RESPONSES = {
  unauthorized: {
    description: '토큰이 없거나 틀렸거나, 탈퇴한 사용자다',
    schema: apiErrorSchema([API_ERROR_CODES.UNAUTHORIZED]),
  },
  invalidDate: {
    description: '조회 기준 날짜가 형식에 맞지 않거나 미래다',
    schema: apiErrorSchema([API_ERROR_CODES.INVALID_DATE]),
  },
  invalidMonthOrDate: {
    description:
      '조회할 달이 형식에 맞지 않거나 기준 날짜보다 뒤의 달이다(INVALID_MONTH), 기준 날짜가 틀렸다(INVALID_DATE)',
    schema: apiErrorSchema([API_ERROR_CODES.INVALID_MONTH, API_ERROR_CODES.INVALID_DATE]),
  },
};

@ApiTags('study-record-stats')
@ApiBearerAuth()
@ApiUnauthorizedResponse(ERROR_RESPONSES.unauthorized)
@Controller('study-record-stats')
export class StudyRecordStatsController {
  constructor(private readonly repository: StudyRecordRepository) {}

  @Get('overview')
  @ApiOkResponse({description: '기준 날짜까지의 연속 기록·누적 통계', schema: OVERVIEW_SCHEMA})
  @ApiBadRequestResponse(ERROR_RESPONSES.invalidDate)
  async overview(
    @CurrentUser() user: UserRow,
    @Query({schema: overviewQuerySchema}) query: z.output<typeof overviewQuerySchema>,
  ) {
    throwIfRejected(checkLookupDate(query.date, getKoreanToday()));

    return calculateOverview(await this.repository.list(user.id, null), query.date);
  }

  @Get('monthly')
  @ApiOkResponse({description: '그 달의 기록 일수·공부시간·실패 태그 통계', schema: MONTHLY_SCHEMA})
  @ApiBadRequestResponse(ERROR_RESPONSES.invalidMonthOrDate)
  async monthly(
    @CurrentUser() user: UserRow,
    @Query({schema: monthlyQuerySchema}) query: z.output<typeof monthlyQuerySchema>,
  ) {
    throwIfRejected(checkLookupDate(query.date, getKoreanToday()));
    throwIfRejected(checkNotFutureMonth(query.month, query.date));

    return calculateMonthly(await this.repository.list(user.id, null), toMonth(query.month.from), query.date);
  }
}
