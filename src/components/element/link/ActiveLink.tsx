'use client';

import React, {Suspense} from 'react';
import {LinkProps} from 'next/link';
import classNames from 'classnames';
import {usePathname, useSearchParams} from 'next/navigation';
import CustomLink, {CustomLinkProps} from '@/components/element/link/CustomLink';

export type LinkActiveMode = 'startsWith' | 'exact';

export interface ActiveLinkProps extends CustomLinkProps {
  /**
   * [startsWith mode]
   * 현재 위치한 URL이 /community/list 이고,
   * to가 /community 이면
   * active 상태로 판단
   *
   * [exact mode]
   * pathname, querystring까지 정확하게 일치해야 active 상태가됨.
   * Usage는, /same/path?query=anotherValue 처럼 링크마다 쿼리스트링만 다른 케이스에서 사용
   */
  mode: LinkActiveMode;
}

/**
 * Doc : [Active Link] https://docs.google.com/document/d/1FmklHJmf9oTMpfqTxHReefj8iSXqphABXP1yoq2nh8M/edit
 */
export default function ActiveLink(props: ActiveLinkProps) {
  // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  return (
    <Suspense>
      <InnerLink {...props} />
    </Suspense>
  );
}

/**
 * href는 "?query=value"와 "/current/path?query=value" 모두 지원함.
 * 이거 export하면 가끔 쓸일 있음 (/mobile-footer 하위 페이지 참고)
 */
export function useCheckHrefIsActive(href: LinkProps['href'], mode: LinkActiveMode): 'active' | undefined {
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const stringHref = convertHrefToString(href);
  const nextUrl = stringHref.startsWith('/') ? stringHref : currentPathname + stringHref;
  const nextPathname = nextUrl.split('?')[0];

  const isActive = mode === 'exact'
    ? nextUrl === currentPathname + (searchParams.size === 0 ? '' : '?' + searchParams.toString())
    // /fruit-fake/sub와 /fruit/sub를 구분하기 위한 코드. 그냥 바로 startWith로 체크하면 /fruit이나 /fruit-fake나 둘 다 active가 됨.
    : currentPathname === nextPathname ? true : currentPathname.startsWith(`${nextPathname}/`);

  if (isActive) {
    return 'active';
  } else {
    return undefined;
  }
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
function InnerLink({ className, href, mode, ...rest }: ActiveLinkProps) {
  const activeClass = useCheckHrefIsActive(href, mode);
  return <CustomLink href={href} className={classNames(className, activeClass)} {...rest} />;
}

function convertHrefToString(href: LinkProps['href']) {
  if (typeof href === 'string') {
    return href;
  }

  if (!href.pathname) {
    return '';
  }

  const url = new URL(href.pathname);

  if (href.query && typeof href.query === 'object') {
    Object.entries(href.query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.pathname + url.search;
}
