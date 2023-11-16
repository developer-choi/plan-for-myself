import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    color: ${props => props.theme.font};
    font-size: 14px;
  }
  
  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
  }
`;
