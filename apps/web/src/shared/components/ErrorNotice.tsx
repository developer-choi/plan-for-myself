import {ReactNode} from 'react';
import classNames from 'classnames';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import Logo from '@/shared/components/Logo';
import styles from './ErrorNotice.module.scss';

interface ErrorNoticeAction {
  children: ReactNode;
  onClick: () => void;
}

interface ErrorNoticeProps {
  title: string;
  content: string;
  action?: ErrorNoticeAction;
  size?: 'large' | 'medium' | 'small';
}

export default function ErrorNotice({title, content, action, size = 'large'}: ErrorNoticeProps) {
  const isSmall = size === 'small';
  const isFullScreen = size === 'large';

  return (
    <div className={styles.container}>
      {!isSmall && <Logo size="large" />}
      <div className={styles.text}>
        <h2 className={classNames(isFullScreen ? typography.h2 : typography.h4, typography.bold)}>{title}</h2>
        <p className={classNames(isFullScreen ? typography.body1 : typography.body2, styles.content)}>{content}</p>
      </div>
      {action && (
        <Button className={styles.action} size={isSmall ? 'medium' : 'large'} onClick={action.onClick}>
          {action.children}
        </Button>
      )}
    </div>
  );
}
