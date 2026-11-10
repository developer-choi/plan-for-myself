import {DATE_TYPES} from '@plan-for-myself/shared/date-type';
import {
  FAILURE_TAG_STATUSES,
  FAILURE_TAG_TREND_STATUSES,
  newStudyRecordSchema,
} from '@plan-for-myself/shared/study-record';
import {z} from 'zod';

const {minItems: STUDIED_MINUTES_MIN_ITEMS, maxItems: STUDIED_MINUTES_MAX_ITEMS} = z.toJSONSchema(
  newStudyRecordSchema.shape.studiedMinutes,
  {target: 'openapi-3.0'},
);

export const STUDY_RECORD_SCHEMA = {
  type: 'object',
  required: ['pk', 'date', 'dateType', 'studiedMinutes', 'failTags'],
  properties: {
    pk: {type: 'integer'},
    date: {type: 'string', format: 'date'},
    dateType: {type: 'string', enum: [...DATE_TYPES]},
    studiedMinutes: {
      type: 'array',
      items: {type: 'integer'},
      minItems: STUDIED_MINUTES_MIN_ITEMS,
      maxItems: STUDIED_MINUTES_MAX_ITEMS,
    },
    failTags: {type: 'array', items: {type: 'string'}},
  },
};

const NULLABLE_NUMBER = {type: 'number', nullable: true};

export const OVERVIEW_SCHEMA = {
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

export const MONTHLY_SCHEMA = {
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
