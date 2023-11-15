import React from 'react';
import type {AppProps} from 'next/app';
import {ThemeProvider} from 'styled-components';
import {theme} from '@util/style/theme';
import {GlobalStyle} from '@util/style/global';

/**
 * https://github.com/vercel/next.js/blob/master/examples/with-styled-components/pages/_app.js
 */
export default function App({Component, pageProps}: AppProps) {
  //https://github.com/styled-components/styled-components/issues/3738
  const ThemeProviderProxy: any = ThemeProvider;
  const GlobalStyleProxy: any = GlobalStyle;

  return (
    <ThemeProviderProxy theme={theme}>
      <GlobalStyleProxy/>
      <Component {...pageProps} />
    </ThemeProviderProxy>
  );
}
