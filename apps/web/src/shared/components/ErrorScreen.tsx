import {type ComponentProps} from 'react';
import ErrorNotice from '@/shared/components/ErrorNotice';
import styles from './ErrorScreen.module.scss';

type ErrorScreenProps = Omit<ComponentProps<typeof ErrorNotice>, 'size'>;

export default function ErrorScreen(props: ErrorScreenProps) {
  return (
    <main className={styles.main}>
      <div className={styles.frame}>
        <ErrorNotice {...props} />
      </div>
    </main>
  );
}
