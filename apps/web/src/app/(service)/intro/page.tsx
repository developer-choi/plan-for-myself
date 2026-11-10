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
import {
  GITHUB_REPOSITORY_URL,
  INTRO_MONTHLY,
  INTRO_STREAK,
  INTRO_TEXT,
  MAKER_URL,
  PRIVACY_POLICY_LABEL,
} from '@plan-for-myself/shared';
import Logo from '@/shared/components/Logo';
import RecordCard from '@/study-record-stats/components/RecordCard';
import styles from './page.module.scss';

interface ActionsSectionProps {
  actions: ReactNode;
}

interface FeatureSectionProps extends PropsWithChildren {
  title: string;
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
        <h1 className={classNames(typography.h2, typography.bold, styles.heading)}>{INTRO_TEXT.heroTitle}</h1>
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
    <FeatureSection description={INTRO_TEXT.recordDescription} title={INTRO_TEXT.recordTitle}>
      <RecordFormPreview />
    </FeatureSection>
  );
}

function TagCalendarSection() {
  return (
    <FeatureSection description={INTRO_TEXT.tagCalendarDescription} title={INTRO_TEXT.tagCalendarTitle}>
      <TagCalendarPreview />
    </FeatureSection>
  );
}

function TrendSection() {
  return (
    <FeatureSection description={INTRO_TEXT.trendDescription} title={INTRO_TEXT.trendTitle}>
      <TrendPreview />
    </FeatureSection>
  );
}

function StreakSection() {
  return (
    <FeatureSection
      description={
        <>
          <span className={styles.phrase}>{INTRO_TEXT.manyFailuresOk}</span>{' '}
          <span className={styles.phrase}>{INTRO_TEXT.highBarManyFailures}</span>
        </>
      }
      title={INTRO_TEXT.consistencyTitle}
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
        <h2 className={classNames(typography.h3, typography.bold, styles.heading)}>{INTRO_TEXT.outroTitle}</h2>
        {actions}
      </div>
    </section>
  );
}

function IntroFooter() {
  return (
    <footer className={classNames(typography.body3, styles.footer)}>
      <Link className={styles.footerLink} href="/privacy">
        {PRIVACY_POLICY_LABEL}
      </Link>
      <span>·</span>
      <a className={styles.footerLink} href={GITHUB_REPOSITORY_URL} rel="noopener" target="_blank">
        {INTRO_TEXT.githubLabel}
      </a>
      <span>·</span>
      <a className={styles.footerLink} href={MAKER_URL} rel="noopener" target="_blank">
        {INTRO_TEXT.makerLabel}
      </a>
    </footer>
  );
}
