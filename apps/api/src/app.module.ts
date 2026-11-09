import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from './db/database.module';
import {HealthController} from './health/health.controller';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, envFilePath: '.env.local'}), DatabaseModule],
  controllers: [HealthController],
})
export class AppModule {}
