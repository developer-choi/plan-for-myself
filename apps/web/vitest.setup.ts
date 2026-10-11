import '@testing-library/jest-dom/vitest';
import {afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';

/* jsdom에는 scrollIntoView가 없어, 부르는 컴포넌트(태그를 고르면 상세로 스크롤하는 통계 등)를 그리면 TypeError가 난다. node 환경 테스트에는 Element가 없다 */
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}

afterEach(() => {
  cleanup();
});
