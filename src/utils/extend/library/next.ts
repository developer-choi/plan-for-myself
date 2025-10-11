import {isServer} from '@forworkchoe/core/utils';
import UAParser from 'ua-parser-js';

/**
 * @deprecated
 * https://docs.google.com/document/d/1EF-ssyURv3WlU9yR6fPhuAHoqn3sP4i9ccxTqCuFDbY/edit?tab=t.0#heading=h.yy4e2dxig7t0
 */
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
