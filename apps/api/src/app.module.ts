import {AuthenticationModule} from '@nestjs/authentication';
import {BadRequestException, Module, StandardSchemaValidationPipe} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {APP_FILTER, APP_PIPE} from '@nestjs/core';
import {APP_TOKEN_AUDIENCE} from '@plan-for-myself/shared/auth';
import {toRejection} from '@plan-for-myself/shared/study-record';
import {AccountModule} from './account/account.module';
import {APP_TOKEN_TTL_DAYS} from './auth/app-token-ttl';
import {AuthModule} from './auth/auth.module';
import {type Env, envSchema} from './config/env';
import {DatabaseModule} from './db/database.module';
import {DemoModule} from './demo/demo.module';
import {ApiExceptionFilter} from './error/api-exception.filter';
import {HealthController} from './health/health.controller';
import {SentryShutdownModule} from './sentry/sentry-shutdown.module';
import {StudyRecordModule} from './study-record/study-record.module';
import {StudyRecordStatsModule} from './study-record-stats/study-record-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env.local', validationSchema: envSchema}),
    DatabaseModule,
    SentryShutdownModule,
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        accessToken: {
          key: config.get('AUTH_SECRET', {infer: true}),
          audience: APP_TOKEN_AUDIENCE,
          ttl: `${APP_TOKEN_TTL_DAYS}d`,
        },
        refreshToken: false,
      }),
    }),
    AuthModule,
    StudyRecordModule,
    StudyRecordStatsModule,
    DemoModule,
    AccountModule,
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
