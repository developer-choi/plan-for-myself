import {ComponentPropsWithoutRef, forwardRef, Ref} from 'react';
import styled from 'styled-components';

export default forwardRef(function Input(props: ComponentPropsWithoutRef<'input'>, ref: Ref<HTMLInputElement>) {
  return <StyledInput ref={ref} {...props}/>
});

const StyledInput = styled.input`
  border: 1px solid gray;
  padding: 10px;
  border-radius: 5px;
  min-width: 250px;
`;
