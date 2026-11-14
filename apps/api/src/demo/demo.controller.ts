import {Public} from '@nestjs/authentication';
import {Controller, Get, Query} from '@nestjs/common';
import {ApiBadRequestResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {parseDateParam} from '@plan-for-myself/shared/date';
import {getDemoResponse} from '@plan-for-myself/shared/demo';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {monthSchema} from '@plan-for-myself/shared/study-record';
import {z} from 'zod';
import {apiErrorSchema} from '../openapi/api-error-schema';
import {MONTHLY_SCHEMA, OVERVIEW_SCHEMA, STUDY_RECORD_SCHEMA} from '../openapi/study-record-schemas';

const demoQuerySchema = z.object({month: monthSchema.optional()});

const DEMO_SCHEMA = {
  type: 'object',
  required: ['today', 'records', 'overview', 'monthly'],
  properties: {
    today: {type: 'string', format: 'date'},
    records: {type: 'array', items: STUDY_RECORD_SCHEMA},
    overview: {
      ...OVERVIEW_SCHEMA,
      properties: {...OVERVIEW_SCHEMA.properties, firstRecordDate: {type: 'string', format: 'date'}},
    },
    monthly: {...MONTHLY_SCHEMA, nullable: true},
  },
};

@Public()
@ApiTags('demo')
@Controller('demo')
export class DemoController {
  @Get()
  @ApiOkResponse({
    description: '예시 화면의 기록과 통계. 미래 달이거나 첫 기록 달보다 앞선 달이면 monthly는 null',
    schema: DEMO_SCHEMA,
  })
  @ApiBadRequestResponse({
    description: '조회할 달이 형식에 맞지 않는다',
    schema: apiErrorSchema([API_ERROR_CODES.INVALID_MONTH]),
  })
  read(@Query({schema: demoQuerySchema}) query: z.output<typeof demoQuerySchema>) {
    return getDemoResponse(query.month ? parseDateParam(query.month.from) : null);
  }
}
