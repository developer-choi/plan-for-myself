import classNames from 'classnames';
import {Spinner} from '@developer-choi/design-system';
import {type FallbackSize} from '@/shared/types/fallback';
import styles from './FallbackSlot.module.scss';

interface LoadingSpinnerProps {
  size?: FallbackSize;
}

export default function LoadingSpinner({size = 'page'}: LoadingSpinnerProps) {
  return (
    <div className={classNames(styles.slot, {[styles.card]: size === 'card'})}>
      <Spinner className={styles.spinner} size={SPINNER_SIZE} />
    </div>
  );
}

const SPINNER_SIZE = 32;
