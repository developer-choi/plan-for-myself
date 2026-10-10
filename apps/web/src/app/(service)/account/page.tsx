import type {Metadata} from 'next';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import GoogleAccount from '@/auth/components/GoogleAccount';
import GuestAccount from '@/auth/components/GuestAccount';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '계정',
};

export default async function Page() {
  const loginState = getLoginState(await auth());

  return (
    <div className={layout.shell}>
      <div className={styles.column}>
        <SubPageHeader title="계정" />
        <main className={styles.body}>{loginState === 'guest' ? <GuestAccount /> : <GoogleAccount />}</main>
      </div>
    </div>
  );
}
