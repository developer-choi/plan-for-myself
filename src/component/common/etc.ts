import styled from 'styled-components';

export const HorizontalFieldset = styled.fieldset`
  gap: 12px;
  display: flex;
  
  > label {
    display: flex;
    align-items: center;
    
    > input {
      margin-right: 4px;
    }
  }
`;
