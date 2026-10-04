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
  size?: 'large' | 'small';
}

export default function ErrorNotice({title, content, action, size = 'large'}: ErrorNoticeProps) {
  const isSmall = size === 'small';

  return (
    <div className={styles.container}>
      {!isSmall && <Logo size="large" />}
      <div className={styles.text}>
        <h2 className={classNames(isSmall ? typography.h4 : typography.h2, typography.bold)}>{title}</h2>
        <p className={classNames(isSmall ? typography.body2 : typography.body1, styles.content)}>{content}</p>
      </div>
      {action && (
        <Button className={styles.action} size={isSmall ? 'medium' : 'large'} onClick={action.onClick}>
          {action.children}
        </Button>
      )}
    </div>
  );
}
