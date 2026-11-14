import {Module} from '@nestjs/common';
import {DatabaseModule} from '../db/database.module';
import {StudyRecordController} from './study-record.controller';
import {StudyRecordRepository} from './study-record.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [StudyRecordController],
  providers: [StudyRecordRepository],
})
export class StudyRecordModule {}
