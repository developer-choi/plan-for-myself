import {Spinner} from '@developer-choi/design-system';
import styles from './FallbackSlot.module.scss';

export default function LoadingSpinner() {
  return (
    <div className={styles.slot}>
      <Spinner className={styles.spinner} size={SPINNER_SIZE} />
    </div>
  );
}

const SPINNER_SIZE = 32;
