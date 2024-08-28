'use client';

import React, {Suspense} from 'react';
import {LinkProps} from 'next/link';
import classNames from 'classnames';
import {usePathname, useSearchParams} from 'next/navigation';
import CustomLink, {CustomLinkProps} from '@/components/element/link/CustomLink';

export type LinkActiveMode = 'path' | 'exact';

export interface ActiveLinkProps extends CustomLinkProps {
  enableActive: {
    mode: LinkActiveMode;
    className: string; // activeClass는 반드시 module stylesheet의 styles 객체에서 전달되야합니다. ex: styles.active
  };
}

/**
 * Doc : [Active Link] https://docs.google.com/document/d/1FmklHJmf9oTMpfqTxHReefj8iSXqphABXP1yoq2nh8M/edit
 * Original : https://github.com/developer-choi/react-playground/commit/80891494f84e1c93c42fb01428d1dbee98133601#diff-4068e2e35f9df0c804ce5a19c46eec8ab1ae31a4dd8234196ae09a1f417cd270
 */
export default function ActiveLink(props: ActiveLinkProps) {
  // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  return (
    <Suspense>
      <InnerLink {...props} />
    </Suspense>
  );
}

function InnerLink({ className, href, enableActive, ...rest }: ActiveLinkProps) {
  const activeClass = useCheckHrefIsActive(href, enableActive);
  return <CustomLink href={href} className={classNames(className, activeClass)} {...rest} />;
}

/**
 * href는 "?query=value"와 "/current/path?query=value" 모두 지원함.
 */
function useCheckHrefIsActive(href: LinkProps['href'], enableActive: ActiveLinkProps['enableActive']): string | undefined {
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const stringHref = convertHrefToString(href);
  const nextUrl = stringHref.startsWith('/') ? stringHref : currentPathname + stringHref;
  const nextPathname = nextUrl.split('?')[0];

  const isActive =
    enableActive.mode === 'exact'
      ? nextUrl === currentPathname + (searchParams.size === 0 ? '' : '?' + searchParams.toString())
      // /fruit-fake/sub와 /fruit/sub를 구분하기 위한 코드. 그냥 바로 startWith로 체크하면 /fruit이나 /fruit-fake나 둘 다 active가 됨.
      : currentPathname === nextPathname ? true : currentPathname.startsWith(`${nextPathname}/`);

  if (isActive) {
    return enableActive.className;
  } else {
    return undefined;
  }
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
