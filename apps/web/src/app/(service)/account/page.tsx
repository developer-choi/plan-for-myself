import type {Metadata} from 'next';
import classNames from 'classnames';
import {ACCOUNT_LABEL} from '@plan-for-myself/shared';
import {CalendarIcon} from '@radix-ui/react-icons';
import {auth} from '@/auth/next-auth';
import {ENTRY_URL} from '@/auth/redirect';
import {getLoginState} from '@/auth/path';
import GoogleAccount from '@/auth/components/GoogleAccount';
import GuestAccount from '@/auth/components/GuestAccount';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: ACCOUNT_LABEL,
};

export default async function Page() {
  const loginState = getLoginState(await auth());

  return (
    <div className={layout.shell}>
      <div className={classNames(layout.centered, layout.narrow)}>
        <SubPageHeader exit={{href: ENTRY_URL, icon: CalendarIcon}} title={ACCOUNT_LABEL} />
        <main className={styles.body}>{loginState === 'guest' ? <GuestAccount /> : <GoogleAccount />}</main>
      </div>
    </div>
  );
}
