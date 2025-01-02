import UAParser from 'ua-parser-js';

export function isServer() {
  return typeof window === 'undefined';
}

export function isMobileOnBothSide(): boolean {
  const userAgent = isServer() ? require('next/headers').headers().get('user-agent') : navigator.userAgent;

  if (!userAgent) {
    return false;
  }

  const parseResult = new UAParser(userAgent);
  return MOBILE_TYPE.includes(parseResult.getDevice().type as any);
}

// 태블릿은 모바일로 간주
const MOBILE_TYPE = ['mobile', 'tablet'];
