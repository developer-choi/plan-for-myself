import {PropsWithChildren} from 'react';
import layoutStyles from '@/styles/layout.module.scss';

export default function Layout({children}: PropsWithChildren) {
  return (
    <div className={layoutStyles.pageContentMedium}>
      {children}
    </div>
  );
}
