import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import TrendBars from '@/study-record-stats/components/TrendBars';
import {INTRO_MONTHLY, INTRO_TAG, INTRO_TEXT, INTRO_TREND} from '@plan-for-myself/shared/intro';
import {toTrendBars} from '@plan-for-myself/shared/study-record-stats';
import styles from './PreviewCard.module.scss';

export default function TrendPreview() {
  return (
    <Card title={INTRO_TAG}>
      <h3 className={classNames(typography.body3, styles.subTitle)}>{INTRO_TEXT.trendSubTitle}</h3>
      <TrendBars bars={toTrendBars(INTRO_TREND)} inProgress={INTRO_MONTHLY.inProgress} />
    </Card>
  );
}
