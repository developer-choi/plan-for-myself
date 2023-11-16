import React, {useCallback} from 'react';
import type {AppProps} from 'next/app';
import {ThemeProvider} from 'styled-components';
import {theme} from '@util/style/theme';
import {GlobalStyle} from '@util/style/global';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {closeModal} from '@store/reducers/modal';
import {Provider} from 'react-redux';
import {store} from '@store/store';

/**
 * https://github.com/vercel/next.js/blob/master/examples/with-styled-components/pages/_app.js
 */
export default function App({Component, pageProps}: AppProps) {
  //https://github.com/styled-components/styled-components/issues/3738
  const ThemeProviderProxy: any = ThemeProvider;
  const GlobalStyleProxy: any = GlobalStyle;

  return (
    <Provider store={store}>
      <ThemeProviderProxy theme={theme}>
        <GlobalStyleProxy/>
        <Component {...pageProps} />
        <ModalRender/>
      </ThemeProviderProxy>
    </Provider>
  );
}

function ModalRender() {
  const modals = useAppSelector(state => state.modal.modals);
  const dispatch = useAppDispatch();

  const close = useCallback((pk: number) => {
    dispatch(closeModal(pk));
  }, [dispatch]);

  return (
    <>
      {modals.map(({pk, Component, props}) => (
        <Component key={pk} closeModal={() => close(pk)} {...props}/>
      ))}
    </>
  );
}
