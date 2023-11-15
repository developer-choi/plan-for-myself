import React from 'react';
import styled from 'styled-components';

export interface SomeComponentProp {

}

export default function SomeComponent({}: SomeComponentProp) {
  return (
    <Wrap>Hello World</Wrap>
  );
}

const Wrap = styled.div`
  background-color: ${props => props.theme.main};
  color: white;
`;
