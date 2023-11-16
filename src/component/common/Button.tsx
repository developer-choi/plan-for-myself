import React, {ComponentPropsWithoutRef, forwardRef, Ref,} from 'react';
import styled, {css} from 'styled-components';

export default forwardRef(function Button(props: ComponentPropsWithoutRef<'button'>, ref: Ref<HTMLButtonElement>) {
  const {type = 'button', ...rest} = props;

  return (
    <StyledButton
      ref={ref}
      type={type}
      {...rest}
    />
  );
});

const buttonHoverEffect = css`
  :hover {
    opacity: 0.7;
  }
  
  :active {
    opacity: 1;
  }
  
  :disabled {
    opacity: initial;
  }
`;

const StyledButton = styled.button`
  padding: 8px 15px;
  min-width: 90px;
  border-radius: 5px; //size에는 border-radius도 포함되고,
  flex-shrink: 0; //버튼들 중에는 길이가 줄어들면 안되는 경우도 있어서 여기에 선언한다.
  background-color: ${props => props.theme.main};
  color: white;
  
  ${buttonHoverEffect};
`;