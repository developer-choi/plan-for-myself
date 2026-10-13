'use client';

import '@developer-choi/design-system/style.css';
import classNames from 'classnames';
import {themeClassName} from '@developer-choi/design-system';
import {ENTRY_URL} from '@/auth/redirect';
import ErrorScreen from '@/shared/components/ErrorScreen';
import {getErrorInfo} from '@/shared/error/info';
import useReportPageError from '@/shared/error/useReportPageError';
import {ENTRY_LABEL} from '@/shared/labels';
import {font} from '@/shared/styles/font';
import {themeStyle} from '@/shared/styles/theme';

interface GlobalErrorProps {
  error: Error & {digest?: string};
  retry: () => void;
}

export default function GlobalError({error, retry}: GlobalErrorProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <html lang="ko">
      <body className={classNames(font.className, themeClassName)} style={themeStyle}>
        <title>Plan for myself</title>
        <ErrorScreen
          action={{children: '다시 시도', onClick: retry}}
          content={content}
          link={{href: ENTRY_URL, label: ENTRY_LABEL}}
          title={title}
        />
      </body>
    </html>
  );
}
