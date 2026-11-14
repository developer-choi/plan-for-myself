import {Public} from '@nestjs/authentication';
import {Controller, Get, Inject} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {sql} from 'drizzle-orm';
import type {Database} from '../db/database';
import {DATABASE} from '../db/database.module';

@Public()
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  @Get()
  @ApiOperation({summary: '헬스 체크', description: '서버와 DB 연결이 살아 있는지 본다'})
  @ApiOkResponse({
    schema: {type: 'object', required: ['status'], properties: {status: {type: 'string', example: 'ok'}}},
  })
  async check() {
    await this.db.execute(sql`SELECT 1`);
    return {status: 'ok'};
  }
}
