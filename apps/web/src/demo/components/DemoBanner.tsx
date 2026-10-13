import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Link from 'next/link';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import {MY_CALENDAR_LABEL, START_RECORDING_LABEL} from '@/shared/labels';
import styles from './DemoBanner.module.scss';

interface DemoBannerProps {
  isLoggedIn: boolean;
}

export default function DemoBanner({isLoggedIn}: DemoBannerProps) {
  return (
    <div className={styles.banner}>
      <p className={classNames(typography.body2, typography.bold, styles.text)}>꾸준히 기록하면 이렇게 보여요</p>
      <Button asChild size="medium">
        {isLoggedIn ? (
          <Link href={DEFAULT_HOME_URL}>{MY_CALENDAR_LABEL}</Link>
        ) : (
          <Link href="/login">{START_RECORDING_LABEL}</Link>
        )}
      </Button>
    </div>
  );
}
