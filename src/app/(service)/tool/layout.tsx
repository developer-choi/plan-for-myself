import {PropsWithChildren} from 'react';
import {auth} from '@/utils/service/auth';
import PrivateLayout from '@/app/(service)/(private)/layout';

export default async function ToolLayout({children}: PropsWithChildren) {
  const session = await auth();

  if (session) {
    return <PrivateLayout>{children}</PrivateLayout>;
  } else {
    return children;
  }
};
