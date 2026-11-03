import {type ReactNode, type RefObject, useRef} from 'react';
import {type StudyRecordMonthly, type StudyRecordOverview, toTrendBars} from '@plan-for-myself/shared';
import {useSelectedFailureTag} from '@plan-for-myself/shared/react';
import {type ScrollView, StyleSheet, View} from 'react-native';
import {spacing} from '@/shared/styles/design-tokens';
import FailCard from '@/study-record-stats/components/FailCard';
import RecordCard from '@/study-record-stats/components/RecordCard';
import StudyCard from '@/study-record-stats/components/StudyCard';
import TagDetailCard from '@/study-record-stats/components/TagDetailCard';

interface StatsSectionProps {
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
  renderTagCalendar: (tag: string) => ReactNode;
  scrollViewRef: RefObject<ScrollView | null>;
}

interface FailSectionProps {
  monthly: StudyRecordMonthly;
  renderTagCalendar: (tag: string) => ReactNode;
  scrollViewRef: RefObject<ScrollView | null>;
}

export default function StatsSection({monthly, overview, renderTagCalendar, scrollViewRef}: StatsSectionProps) {
  return (
    <View style={styles.cards}>
      <FailSection monthly={monthly} renderTagCalendar={renderTagCalendar} scrollViewRef={scrollViewRef} />
      <RecordCard
        monthly={monthly}
        streak={overview?.streak ?? null}
        totalRecordedDays={overview?.totals.recordedDays ?? null}
      />
      <StudyCard monthly={monthly} totalStudiedMinutes={overview?.totals.studiedMinutes ?? null} />
    </View>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: spacing.md,
  },
});

function FailSection({monthly, renderTagCalendar, scrollViewRef}: FailSectionProps) {
  const detailRef = useRef<View>(null);
  const {selection, selectedFailure} = useSelectedFailureTag({
    failureTags: monthly.failureTags,
    onOpen: () => {
      const scrollView = scrollViewRef.current;
      const scrollHost = scrollView?.getNativeScrollRef();
      if (!scrollView || !scrollHost) {
        return;
      }

      detailRef.current?.measureLayout(scrollHost, (_left, top) => {
        scrollView.scrollTo({y: top - spacing.sm});
      });
    },
  });

  return (
    <>
      <FailCard monthly={monthly} selection={selection} />
      {selectedFailure && (
        <TagDetailCard
          ref={detailRef}
          calendar={renderTagCalendar(selectedFailure.tag)}
          tag={selectedFailure.tag}
          trend={{bars: toTrendBars(selectedFailure.trend), inProgress: monthly.inProgress}}
        />
      )}
    </>
  );
}
