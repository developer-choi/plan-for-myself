"use client";

import {useSession} from "next-auth/react";
import {PropsWithChildren, useEffect} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {getNextNavigating} from '@/util/sevices/auth/path';

export default function InnerSessionProvider({children}: PropsWithChildren) {
  const {status} = useSession();
  const {replace} = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const nextNavigating = getNextNavigating({
      nextPathname: pathname,
      redirectUrl: pathname + '?' + searchParams.toString(),
      isLoggedIn: status === 'authenticated'
    });

    if (nextNavigating.type !== "correct") {
      replace(nextNavigating.nextUrl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return children;
}
