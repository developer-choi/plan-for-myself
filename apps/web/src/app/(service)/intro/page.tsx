import {type PropsWithChildren, type ReactNode} from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import FailurePreview from '@/intro/components/FailurePreview';
import IntroFrame from '@/intro/components/IntroFrame';
import LoggedInIntroActions from '@/intro/components/LoggedInIntroActions';
import LoggedOutIntroActions from '@/intro/components/LoggedOutIntroActions';
import RecordFormPreview from '@/intro/components/RecordFormPreview';
import TagCalendarPreview from '@/intro/components/TagCalendarPreview';
import TrendPreview from '@/intro/components/TrendPreview';
import {INTRO_MONTHLY, INTRO_STREAK} from '@/intro/intro-examples';
import Logo from '@/shared/components/Logo';
import RecordCard from '@/study-record-stats/components/RecordCard';
import styles from './page.module.scss';

interface ActionsSectionProps {
  actions: ReactNode;
}

interface FeatureSectionProps extends PropsWithChildren {
  title: ReactNode;
  description: ReactNode;
}

export default async function Page() {
  const isLoggedIn = getLoginState(await auth()) !== 'logged-out';
  const actions = isLoggedIn ? <LoggedInIntroActions /> : <LoggedOutIntroActions />;

  return (
    <main className={styles.page}>
      <HeroSection actions={actions} />
      <RecordSection />
      <TagCalendarSection />
      <TrendSection />
      <StreakSection />
      <OutroSection actions={actions} />
      <IntroFooter />
    </main>
  );
}

function HeroSection({actions}: ActionsSectionProps) {
  return (
    <section className={styles.band}>
      <div className={classNames(styles.section, styles.hero)}>
        <div className={styles.brand}>
          <Logo size="medium" />
          <span className={classNames(typography.body2, styles.brandName)}>Plan for myself</span>
        </div>
        <h1 className={classNames(typography.h2, typography.bold, styles.heading)}>
          실패를 기록하고,
          <br />
          같은 실패를 줄여 나가요
        </h1>
        <IntroFrame>
          <FailurePreview />
        </IntroFrame>
        {actions}
      </div>
    </section>
  );
}

function RecordSection() {
  return (
    <FeatureSection
      description="스스로 실패를 정하고, 기록을 보며 개선해 나가요"
      title={
        <>
          그날 공부시간과
          <br />
          실패를 적어요
        </>
      }
    >
      <RecordFormPreview />
    </FeatureSection>
  );
}

function TagCalendarSection() {
  return (
    <FeatureSection
      description="한 가지 실패를 적은 날만 달력에 표시해요"
      title={
        <>
          실패가 어느 날에
          <br />
          몰리는지 보여 줘요
        </>
      }
    >
      <TagCalendarPreview />
    </FeatureSection>
  );
}

function TrendSection() {
  return (
    <FeatureSection
      description="한 가지 실패를 달마다 몇 번 적었는지 이어서 보여 줘요"
      title={
        <>
          같은 실패가
          <br />
          반복되는지 알려 줘요
        </>
      }
    >
      <TrendPreview />
    </FeatureSection>
  );
}

function StreakSection() {
  return (
    <FeatureSection
      description={
        <>
          <span className={styles.phrase}>실패가 많아도 괜찮아요.</span>{' '}
          <span className={styles.phrase}>기준을 높게 잡을수록 실패는 많이 적혀요</span>
        </>
      }
      title="꾸준히 적는 게 먼저예요"
    >
      <RecordCard monthly={INTRO_MONTHLY} streak={INTRO_STREAK} totalRecordedDays={null} />
    </FeatureSection>
  );
}

function FeatureSection({title, description, children}: FeatureSectionProps) {
  return (
    <section className={styles.band}>
      <div className={styles.section}>
        <div className={styles.featureHeader}>
          <h2 className={classNames(typography.h3, typography.bold, styles.heading)}>{title}</h2>
          <p className={classNames(typography.body2, styles.description)}>{description}</p>
        </div>
        <IntroFrame className={styles.frame}>{children}</IntroFrame>
      </div>
    </section>
  );
}

function OutroSection({actions}: ActionsSectionProps) {
  return (
    <section className={styles.band}>
      <div className={styles.section}>
        <h2 className={classNames(typography.h3, typography.bold, styles.heading)}>
          같은 실패,
          <br />
          오늘부터 줄여 나가요
        </h2>
        {actions}
      </div>
    </section>
  );
}

function IntroFooter() {
  return (
    <footer className={classNames(typography.body3, styles.footer)}>
      <Link className={styles.footerLink} href="/privacy">
        개인정보 처리방침
      </Link>
      <span>·</span>
      <a className={styles.footerLink} href={GITHUB_REPOSITORY_URL} rel="noopener" target="_blank">
        GitHub
      </a>
      <span>·</span>
      <a className={styles.footerLink} href={MAKER_URL} rel="noopener" target="_blank">
        만든 사람
      </a>
    </footer>
  );
}

const GITHUB_REPOSITORY_URL = 'https://github.com/developer-choi/plan-for-myself';
const MAKER_URL = 'https://github.com/developer-choi';
