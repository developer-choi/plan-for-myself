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

export const MainPageH2 = styled.h2`
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 5px;
`;
