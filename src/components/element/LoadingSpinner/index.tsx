import styles from './index.module.scss';
import {BRAND_COLOR} from '@/styles/color';
import {LoadingSpinner} from '@forworkchoe/core/components';

export function LoadingPage() {
  return (
    <div className={styles.pageWrap}>
      <LoadingSpinner square={50} strokeWidth={8} fill={BRAND_COLOR.primary}/>
    </div>
  )
}
