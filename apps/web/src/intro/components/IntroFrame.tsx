import {type PropsWithChildren} from 'react';
import classNames from 'classnames';
import styles from './IntroFrame.module.scss';

interface IntroFrameProps extends PropsWithChildren {
  className?: string;
}

export default function IntroFrame({className, children}: IntroFrameProps) {
  return (
    <div inert className={classNames(styles.frame, className)}>
      {children}
    </div>
  );
}
