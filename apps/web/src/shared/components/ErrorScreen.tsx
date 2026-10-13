import {type ComponentProps} from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import typography from '@developer-choi/design-system/styles/typography';
import ErrorNotice from '@/shared/components/ErrorNotice';
import styles from './ErrorScreen.module.scss';

interface ErrorScreenProps extends Omit<ComponentProps<typeof ErrorNotice>, 'size'> {
  /* undefined: 버튼 말고 다른 화면으로 갈 링크가 없는 경우 */
  link?: ErrorScreenLink;
}

interface ErrorScreenLink {
  href: string;
  label: string;
}

export default function ErrorScreen({link, ...props}: ErrorScreenProps) {
  return (
    <main className={styles.main}>
      <div className={styles.frame}>
        <ErrorNotice {...props} />
        {link && (
          <Link className={classNames(typography.body2, styles.link)} href={link.href}>
            {link.label}
          </Link>
        )}
      </div>
    </main>
  );
}
