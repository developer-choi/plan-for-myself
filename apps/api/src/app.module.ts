import {AuthenticationModule} from '@nestjs/authentication';
import {BadRequestException, Module, StandardSchemaValidationPipe} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_FILTER, APP_PIPE} from '@nestjs/core';
import {toRejection} from '@plan-for-myself/shared/study-record';
import {AuthModule} from './auth/auth.module';
import {DatabaseModule} from './db/database.module';
import {ApiExceptionFilter} from './error/api-exception.filter';
import {HealthController} from './health/health.controller';
import {SentryShutdownModule} from './sentry/sentry-shutdown.module';
import {StudyRecordModule} from './study-record/study-record.module';
import {StudyRecordStatsModule} from './study-record-stats/study-record-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env.local'}),
    DatabaseModule,
    SentryShutdownModule,
    AuthenticationModule.forRoot(),
    AuthModule,
    StudyRecordModule,
    StudyRecordStatsModule,
  ],
  controllers: [HealthController],
  providers: [
    {provide: APP_FILTER, useClass: ApiExceptionFilter},
    {
      provide: APP_PIPE,
      useValue: new StandardSchemaValidationPipe({
        exceptionFactory: (issues) => new BadRequestException(toRejection(issues)),
      }),
    },
  ],
})
export class AppModule {}
