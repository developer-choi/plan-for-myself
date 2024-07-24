import {ComponentPropsWithRef} from "react";
import styles from './index.module.scss';
import classNames from 'classnames';

interface SpinnerProps extends ComponentPropsWithRef<"svg"> {
  strokeWidth?: number; // default 5
  fill?: string;
  square?: number;
}

export default function LoadingSpinner({square = 20, strokeWidth = 3, fill = 'black', className, ...rest}: SpinnerProps) {
  return (
    <svg viewBox={`0 0 ${square} ${square}`} width={square} height={square} className={classNames(className, styles.svg)} {...rest}>
      <circle cx={square / 2} cy={square / 2} r={(square / 2) - (strokeWidth / 2)} fill="none" stroke={fill} strokeWidth={strokeWidth}></circle>
    </svg>
  );
}
