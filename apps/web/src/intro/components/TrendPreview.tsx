import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import TrendBars from '@/study-record-stats/components/TrendBars';
import {toTrendBars} from '@/study-record-stats/tag-detail';
import {INTRO_TREND, INTRO_TREND_TAG} from '@/intro/intro-examples';
import styles from './TrendPreview.module.scss';

export default function TrendPreview() {
  return (
    <Card title={INTRO_TREND_TAG}>
      <h3 className={classNames(typography.body3, styles.subTitle)}>월별 추이</h3>
      <TrendBars bars={toTrendBars(INTRO_TREND)} />
    </Card>
  );
}
