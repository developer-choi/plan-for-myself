import {type ReactNode, type RefObject, useImperativeHandle, useRef} from 'react';
import {
  getFirstFailureTagName,
  type StudyRecordMonthly,
  type StudyRecordOverview,
  toTrendBars,
} from '@plan-for-myself/shared';
import {useSelectedFailureTag} from '@plan-for-myself/shared/react';
import {type ScrollView, StyleSheet, View} from 'react-native';
import {spacing} from '@/shared/styles/design-tokens';
import FailCard, {type FailCardTourTargets} from '@/study-record-stats/components/FailCard';
import RecordCard from '@/study-record-stats/components/RecordCard';
import StudyCard from '@/study-record-stats/components/StudyCard';
import TagDetailCard from '@/study-record-stats/components/TagDetailCard';

export interface StatsTourTargets extends FailCardTourTargets {
  tagDetailCardRef: RefObject<View | null>;
  firstTagOpenerRef: RefObject<FirstTagOpener | null>;
}

interface FirstTagOpener {
  openFirstTag: (scrollRoom: number) => void;
}

interface StatsSectionProps {
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
  renderTagCalendar: (tag: string) => ReactNode;
  scrollViewRef: RefObject<ScrollView | null>;
  tourTargets?: StatsTourTargets;
}

interface FailSectionProps {
  monthly: StudyRecordMonthly;
  renderTagCalendar: (tag: string) => ReactNode;
  scrollViewRef: RefObject<ScrollView | null>;
  tourTargets: StatsTourTargets | undefined;
}

export default function StatsSection({
  monthly,
  overview,
  renderTagCalendar,
  scrollViewRef,
  tourTargets,
}: StatsSectionProps) {
  return (
    <View style={styles.cards}>
      <FailSection
        monthly={monthly}
        renderTagCalendar={renderTagCalendar}
        scrollViewRef={scrollViewRef}
        tourTargets={tourTargets}
      />
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

function FailSection({monthly, renderTagCalendar, scrollViewRef, tourTargets}: FailSectionProps) {
  const ownDetailRef = useRef<View>(null);
  const detailRef = tourTargets?.tagDetailCardRef ?? ownDetailRef;
  const pendingScrollRoomCache = useRef(0);
  const {selection, selectedFailure} = useSelectedFailureTag({
    failureTags: monthly.failureTags,
    onOpen: () => {
      const scrollView = scrollViewRef.current;
      const scrollHost = scrollView?.getNativeScrollRef();
      if (!scrollView || !scrollHost) {
        return;
      }

      detailRef.current?.measureLayout(scrollHost, (_left, top) => {
        scrollView.scrollTo({y: top - spacing.sm - pendingScrollRoomCache.current});
        pendingScrollRoomCache.current = 0;
      });
    },
  });

  useImperativeHandle(tourTargets?.firstTagOpenerRef, () => ({
    openFirstTag: (scrollRoom) => {
      const firstTag = getFirstFailureTagName(monthly.failureTags);

      if (firstTag !== undefined && firstTag !== selection.selectedTag) {
        pendingScrollRoomCache.current = scrollRoom;
        selection.onSelect(firstTag);
      }
    },
  }));

  return (
    <>
      <FailCard monthly={monthly} selection={selection} tourTargets={tourTargets} />
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
