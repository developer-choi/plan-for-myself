import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import TrendBars from '@/study-record-stats/components/TrendBars';
import {toTrendBars} from '@/study-record-stats/tag-detail';
import {INTRO_MONTHLY, INTRO_TAG, INTRO_TREND} from '@/intro/intro-examples';
import styles from './PreviewCard.module.scss';

export default function TrendPreview() {
  return (
    <Card title={INTRO_TAG}>
      <h3 className={classNames(typography.body3, styles.subTitle)}>월별 추이</h3>
      <TrendBars bars={toTrendBars(INTRO_TREND)} inProgress={INTRO_MONTHLY.inProgress} />
    </Card>
  );
}
