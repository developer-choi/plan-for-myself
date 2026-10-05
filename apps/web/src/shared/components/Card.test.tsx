import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Card from './Card';

describe('Card', () => {
  describe('General cases', () => {
    it('제목을 넘기면 제목이 보인다', () => {
      render(<Card title="기록" />);

      expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument();
    });

    it('제목과 보조 글을 넘기지 않으면 카드에 아무것도 보이지 않는다', () => {
      const {container} = render(<Card />);

      expect(container.firstElementChild).toBeEmptyDOMElement();
    });

    it('className을 넘기면 카드 바깥 요소에 붙는다', () => {
      const className = 'extra';
      const {container} = render(<Card className={className} />);

      expect(container.firstElementChild).toHaveClass(className);
    });
  });

  describe('Edge cases', () => {
    it('보조 글이 숫자 0이어도 보인다', () => {
      const {container} = render(<Card aside={0} />);

      expect(container.firstElementChild).toHaveTextContent(/^0$/);
    });

    [
      {empty: '', name: '빈 문자열'},
      {empty: false, name: 'false'},
    ].forEach(({empty, name}) => {
      it(`제목과 보조 글이 ${name}이면 카드에 아무것도 보이지 않는다`, () => {
        const {container} = render(<Card aside={empty} title={empty} />);

        expect(container.firstElementChild).toBeEmptyDOMElement();
      });
    });
  });
});
