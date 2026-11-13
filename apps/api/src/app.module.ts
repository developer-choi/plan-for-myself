import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_FILTER} from '@nestjs/core';
import {DatabaseModule} from './db/database.module';
import {ApiExceptionFilter} from './error/api-exception.filter';
import {HealthController} from './health/health.controller';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, envFilePath: '.env.local'}), DatabaseModule],
  controllers: [HealthController],
  providers: [{provide: APP_FILTER, useClass: ApiExceptionFilter}],
})
export class AppModule {}
