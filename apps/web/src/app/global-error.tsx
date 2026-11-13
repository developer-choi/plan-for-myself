'use client';

import '@developer-choi/design-system/style.css';
import classNames from 'classnames';
import {themeClassName} from '@developer-choi/design-system';
import {ENTRY_LABEL, RETRY_LABEL} from '@plan-for-myself/shared/label';
import {getErrorInfo} from '@plan-for-myself/shared/error';
import {ENTRY_URL} from '@/auth/redirect';
import ErrorNotice from '@/shared/components/ErrorNotice';
import useReportPageError from '@/shared/error/useReportPageError';
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
        <ErrorNotice
          action={{children: RETRY_LABEL, onClick: retry}}
          content={content}
          link={{href: ENTRY_URL, label: ENTRY_LABEL}}
          title={title}
        />
      </body>
    </html>
  );
}
