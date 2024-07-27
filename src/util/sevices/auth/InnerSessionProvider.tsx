"use client";

import {useSession} from "next-auth/react";
import {PropsWithChildren, useCallback} from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {getNextNavigating} from '@/util/sevices/auth/path';
import {useEffectFromTheSecondTime} from '@/util/extend/react';
/**
 * https://docs.google.com/document/d/1SQKE-pymRA1941tgN5sORI-MdqnP_mmd4F-SpLH9xpU/edit#heading=h.o2dttbhzlqr
 *
 * 여기 로직이 실행되기를 의도했던것은
 * (페이지 접근 허용받아서 private / guest / guest 등에 접근 한 후)
 * 1. 다른 탭에서 로그아웃 하면 모든 탭에서 로그아웃 시키는거랑 (아마 웹소켓...)
 * 2. 현재 탭에서 로그아웃 (signOut할 때 굳이 callbackUrl등록안함) 하기 위함이었음.
 *
 * 그래서 미들웨어가 이 로직 앞단에서 실행되어 페이지 접근 시점에서는 아래 로직이 실행되면 안됨.
 * 만약 접근 하면 안되는 페이지에 접근하는데 리다이랙트가 체감상 0.1초라도 걸린다면 그건 미들웨어가 실행 안되었음을 의심행봐야함.
 * 체감상 0.000001초만에 리다이랙트가 되야함. 미들웨어에서 막혔다면
 */
export default function InnerSessionProvider({children}: PropsWithChildren) {
  const {status} = useSession();
  const {replace} = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffectFromTheSecondTime(useCallback(() => {
    const nextNavigating = getNextNavigating({
      nextPathname: pathname,
      redirectUrl: pathname + '?' + searchParams.toString(),
      isLoggedIn: status === 'authenticated'
    });

    if (nextNavigating.type !== "correct") {
      replace(nextNavigating.nextUrl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]));

  return children;
}
