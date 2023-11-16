import styled, {css, DefaultTheme, StyledComponent} from 'styled-components';

const buttonHoverEffect = css`
  &:not(:disabled) {
    :hover {
      opacity: 0.7;
    }
    
    :active {
      opacity: 1;
    }
  }
`;

export const BaseButton: StyledComponent<'button', DefaultTheme> = styled.button.attrs(({type = 'button', ...rest}) => ({...rest, type}))`
  ${buttonHoverEffect}
  
  &.gray {
    background: darkgray;
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  &:not(:disabled) {
    cursor: pointer;
  }
`;

const Button: StyledComponent<'button', DefaultTheme> = styled(BaseButton)`
  padding: 8px 15px;
  min-width: 90px;
  border-radius: 5px; //size에는 border-radius도 포함되고,
  flex-shrink: 0; //버튼들 중에는 길이가 줄어들면 안되는 경우도 있어서 여기에 선언한다.
  background-color: ${props => props.theme.main};
  color: white;
`;

export default Button
