import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, INTRO_TEXT} from '@plan-for-myself/shared';
import {useSession} from '@/auth/session-context';
import FailurePreview from '@/intro/components/FailurePreview';
import FeatureSection from '@/intro/components/FeatureSection';
import HeroSection from '@/intro/components/HeroSection';
import IntroFooter from '@/intro/components/IntroFooter';
import LoggedInIntroActions from '@/intro/components/LoggedInIntroActions';
import LoggedOutIntroActions from '@/intro/components/LoggedOutIntroActions';
import OutroSection from '@/intro/components/OutroSection';
import RecordFormPreview from '@/intro/components/RecordFormPreview';
import StreakPreview from '@/intro/components/StreakPreview';
import TagCalendarPreview from '@/intro/components/TagCalendarPreview';
import TrendPreview from '@/intro/components/TrendPreview';

export default function IntroScreen() {
  const {session} = useSession();
  const actions = session.token === null ? <LoggedOutIntroActions /> : <LoggedInIntroActions />;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <ScrollView>
        <HeroSection actions={actions} preview={<FailurePreview />} />
        <FeatureSection description={INTRO_TEXT.recordDescription} title={INTRO_TEXT.recordTitle} onSubtleBand>
          <RecordFormPreview />
        </FeatureSection>
        <FeatureSection description={INTRO_TEXT.tagCalendarDescription} title={INTRO_TEXT.tagCalendarTitle}>
          <TagCalendarPreview />
        </FeatureSection>
        <FeatureSection description={INTRO_TEXT.trendDescription} title={INTRO_TEXT.trendTitle} onSubtleBand>
          <TrendPreview />
        </FeatureSection>
        <FeatureSection
          description={[INTRO_TEXT.manyFailuresOk, INTRO_TEXT.highBarManyFailures]}
          title={INTRO_TEXT.consistencyTitle}
        >
          <StreakPreview />
        </FeatureSection>
        <OutroSection actions={actions} />
        <IntroFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.card,
  },
});
