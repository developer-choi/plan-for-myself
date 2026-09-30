import {ReactNode} from 'react';
import classNames from 'classnames';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import Logo from '@/components/logo/Logo';
import styles from './ErrorNotice.module.scss';

interface ErrorNoticeAction {
  children: ReactNode;
  onClick: () => void;
}

interface ErrorNoticeProps {
  title: string;
  content: string;
  action?: ErrorNoticeAction;
}

export default function ErrorNotice({title, content, action}: ErrorNoticeProps) {
  return (
    <div className={styles.container}>
      <Logo size={LOGO_SIZE} />
      <div className={styles.text}>
        <h2 className={classNames(typography.h2, typography.bold)}>{title}</h2>
        <p className={classNames(typography.body1, styles.content)}>{content}</p>
      </div>
      {action && (
        <Button className={styles.action} size="large" onClick={action.onClick}>
          {action.children}
        </Button>
      )}
    </div>
  );
}

const LOGO_SIZE = 64;
