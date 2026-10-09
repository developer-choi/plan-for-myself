import {type PropsWithChildren, type ReactNode} from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import CalendarPreview from '@/intro/components/CalendarPreview';
import FailurePreview from '@/intro/components/FailurePreview';
import IntroFrame from '@/intro/components/IntroFrame';
import LoggedInIntroActions from '@/intro/components/LoggedInIntroActions';
import LoggedOutIntroActions from '@/intro/components/LoggedOutIntroActions';
import RecordFormPreview from '@/intro/components/RecordFormPreview';
import TrendPreview from '@/intro/components/TrendPreview';
import Logo from '@/shared/components/Logo';
import styles from './page.module.scss';

interface ActionsSectionProps {
  actions: ReactNode;
}

interface FeatureSectionProps extends PropsWithChildren {
  title: ReactNode;
  description: string;
}

export default async function Page() {
  const isLoggedIn = getLoginState(await auth()) !== 'logged-out';
  const actions = isLoggedIn ? <LoggedInIntroActions /> : <LoggedOutIntroActions />;

  return (
    <main className={styles.page}>
      <HeroSection actions={actions} />
      <RecordSection />
      <CalendarSection />
      <FailureSection />
      <OutroSection actions={actions} />
      <IntroFooter />
    </main>
  );
}

function HeroSection({actions}: ActionsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.brand}>
        <Logo size="medium" />
        <span className={classNames(typography.body2, styles.brandName)}>Plan for Myself</span>
      </div>
      <h1 className={classNames(typography.h2, typography.bold, styles.heading)}>
        스스로 목표를 세우고 달성하는 것을 돕습니다
      </h1>
      <IntroFrame>
        <TrendPreview />
      </IntroFrame>
      {actions}
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

function CalendarSection() {
  return (
    <FeatureSection
      description="빨간 태그가 이어지면 실패가 이어지고 있다는 뜻이에요. 적지 않은 날은 빈칸으로 남고, 연속 기록이 끊겨요"
      title={
        <>
          실패가 이어지는지
          <br />
          한눈에 보여요
        </>
      }
    >
      <CalendarPreview />
    </FeatureSection>
  );
}

function FailureSection() {
  return (
    <FeatureSection
      description="지난달과 비교해 반복하는 실패, 새로 생긴 실패, 줄어든 실패를 나눠 보여 줘요. 줄어든 실패는 개선된 실패로 쌓여요"
      title={
        <>
          같은 실패가
          <br />
          반복되는지 알려 줘요
        </>
      }
    >
      <FailurePreview />
    </FeatureSection>
  );
}

function FeatureSection({title, description, children}: FeatureSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={classNames(typography.h3, typography.bold, styles.heading)}>{title}</h2>
      <p className={classNames(typography.body2, styles.description)}>{description}</p>
      <IntroFrame>{children}</IntroFrame>
    </section>
  );
}

function OutroSection({actions}: ActionsSectionProps) {
  return (
    <section className={styles.outro}>
      <div className={styles.section}>
        <h2 className={classNames(typography.h3, typography.bold, styles.heading)}>
          스스로 세운 목표,
          <br />
          오늘부터 시작해요
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
