import type {ReactNode, Ref} from 'react';
import type {TrendBar} from '@plan-for-myself/shared';
import {StyleSheet, View} from 'react-native';
import Card from '@/shared/components/Card';
import {spacing} from '@/shared/styles/design-tokens';
import TrendBars from '@/study-record-stats/components/TrendBars';

interface TagTrend {
  bars: TrendBar[];
  inProgress: boolean;
}

interface TagDetailCardProps {
  tag: string;
  calendar: ReactNode;
  trend: TagTrend;
  ref: Ref<View>;
}

export default function TagDetailCard({tag, calendar, trend, ref}: TagDetailCardProps) {
  const hasTrend = trend.bars.length > 1;

  return (
    <View ref={ref}>
      <Card title={tag}>
        <View style={styles.sections}>
          {calendar}
          {hasTrend && <TrendBars bars={trend.bars} inProgress={trend.inProgress} />}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: spacing.md,
  },
});
