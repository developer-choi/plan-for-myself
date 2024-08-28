import Link, {LinkProps} from 'next/link';
import React, {CSSProperties, PropsWithChildren} from 'react';

export interface CustomLinkProps extends PropsWithChildren<LinkProps> {
  style?: CSSProperties;
  className?: string;
}

export default function CustomLink({prefetch = false, ...rest}: CustomLinkProps) {
  return (
    <Link prefetch={prefetch} {...rest}/>
  );
}
