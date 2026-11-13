import {INTRO_MONTHLY, INTRO_TAG, INTRO_TEXT, INTRO_TREND} from '@plan-for-myself/shared/intro';
import {toTrendBars} from '@plan-for-myself/shared/study-record-stats';
import PreviewSubTitle from '@/intro/components/PreviewSubTitle';
import Card from '@/shared/components/Card';
import TrendBars from '@/study-record-stats/components/TrendBars';

export default function TrendPreview() {
  return (
    <Card title={INTRO_TAG}>
      <PreviewSubTitle>{INTRO_TEXT.trendSubTitle}</PreviewSubTitle>
      <TrendBars bars={BARS} inProgress={INTRO_MONTHLY.inProgress} />
    </Card>
  );
}

const BARS = toTrendBars(INTRO_TREND);
