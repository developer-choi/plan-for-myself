import styled, {css} from 'styled-components';

const InputCss = css`
  border: 1px solid gray;
  padding: 10px;
  border-radius: 5px;
  min-width: 250px;
  font-family: sans-serif;
`;

export const Input = styled.input`
  ${InputCss};
`;

export const TextArea = styled.textarea`
  ${InputCss};
  min-height: 100px;
  resize: none;
`;