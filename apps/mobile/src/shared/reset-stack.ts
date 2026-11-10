import {type Href, router} from 'expo-router';

/* 예시·소개 라우트는 로그인 가드 밖이라 스택에 남으면 가드가 지우지 않는다. 메뉴로 push해 들어온 스택에 replace만 하면 달력이 겹친다 */
export function resetStackTo(href: Href) {
  if (router.canDismiss()) {
    router.dismissAll();
  }

  router.replace(href);
}
