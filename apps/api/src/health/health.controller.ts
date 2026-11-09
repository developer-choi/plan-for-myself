import {Controller, Get, Inject} from '@nestjs/common';
import {sql} from 'drizzle-orm';
import type {Database} from '../db/database';
import {DATABASE} from '../db/database.module';

@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  @Get()
  async check() {
    await this.db.execute(sql`SELECT 1`);
    return {status: 'ok'};
  }
}
