import {Module} from '@nestjs/common';
import {StudyRecordModule} from '../study-record/study-record.module';
import {StudyRecordStatsController} from './study-record-stats.controller';

@Module({
  imports: [StudyRecordModule],
  controllers: [StudyRecordStatsController],
})
export class StudyRecordStatsModule {}
