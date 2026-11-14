import {type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {SentryExceptionCaptured} from '@sentry/nestjs';
import {DrizzleQueryError} from 'drizzle-orm';
import {API_ERROR_CODES, type ApiErrorBody, type ApiErrorCode} from '@plan-for-myself/shared/error';
import {readPostgresError} from '../db/postgres-error';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost) {
    const {status, body} = toResponse(exception);
    this.httpAdapterHost.httpAdapter.reply(host.switchToHttp().getResponse(), body, status);
  }
}

const INTERNAL_ERROR_MESSAGE = '서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요';

const ERROR_CODE_BY_STATUS: Partial<Record<number, ApiErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: API_ERROR_CODES.INVALID_BODY,
  [HttpStatus.PAYLOAD_TOO_LARGE]: API_ERROR_CODES.INVALID_BODY,
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: API_ERROR_CODES.INVALID_BODY,
  [HttpStatus.UNAUTHORIZED]: API_ERROR_CODES.UNAUTHORIZED,
  [HttpStatus.NOT_FOUND]: API_ERROR_CODES.NOT_FOUND,
};

const FIXED_MESSAGE_BY_CODE: Partial<Record<ApiErrorCode, string>> = {
  [API_ERROR_CODES.INVALID_BODY]: '요청 형식이 올바르지 않아요',
  [API_ERROR_CODES.NOT_FOUND]: '요청한 주소를 찾을 수 없어요',
  [API_ERROR_CODES.UNAUTHORIZED]: '로그인이 필요해요',
};

const API_ERROR_CODE_VALUES: readonly string[] = Object.values(API_ERROR_CODES);

const logger = new Logger('ApiExceptionFilter');

function toResponse(exception: unknown): {status: number; body: ApiErrorBody} {
  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const response = exception.getResponse();
    if (isApiErrorBody(response)) {
      return {status, body: {code: response.code, message: response.message}};
    }
    const code = ERROR_CODE_BY_STATUS[status] ?? API_ERROR_CODES.INTERNAL_ERROR;
    const message = FIXED_MESSAGE_BY_CODE[code] ?? exception.message;
    return {status, body: {code, message}};
  }

  logger.error('처리하지 못한 예외', describeException(exception));
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    body: {code: API_ERROR_CODES.INTERNAL_ERROR, message: INTERNAL_ERROR_MESSAGE},
  };
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'string' &&
    API_ERROR_CODE_VALUES.includes(value.code) &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

/* DrizzleQueryError의 message와 Postgres 에러 message(형 변환 실패 등)에는 쿼리 값(사용자 정보)이 들어 있어 SQL 문장과 값 없는 원인 필드만 남긴다 */
function describeException(exception: unknown): string {
  if (exception instanceof DrizzleQueryError) {
    const stack = (exception.stack ?? exception.message).replace(
      exception.message,
      () => `Failed query: ${exception.query}`,
    );
    return [stack, `Caused by: ${describeQueryCause(exception)}`].join('\n');
  }
  return exception instanceof Error ? (exception.stack ?? exception.message) : String(exception);
}

function describeQueryCause(exception: DrizzleQueryError): string {
  const fields = readPostgresError(exception);
  if (fields?.code !== undefined) {
    const {code, constraint, table, column} = fields;
    return JSON.stringify({code, constraint, table, column});
  }
  return exception.cause ? `${exception.cause.name}: ${exception.cause.message}` : '알 수 없음';
}
