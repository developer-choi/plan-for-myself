import React, {ComponentPropsWithRef, forwardRef} from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import CheckIcon from '@/components/icon/CheckIcon';
import UncheckIcon from '@/components/icon/UncheckIcon';

// https://docs.google.com/document/d/1rqmOi11-M61mjOkk5i63SigHNN8BJYLpka8c73tSLb0/edit?usp=drivesdk
export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label?: string;
  color?: 'primary' | 'secondary';
  square?: number; // 체크박스 아이콘 가로세로 크기
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const { style, className, label, color = 'primary', square, ...rest } = props;

  return (
    <label style={style} className={classNames(styles.wrapper, styles[color], className)}>
      <CheckIcon square={square} className={styles.checked}/>
      <UncheckIcon square={square} className={styles.unchecked}/>
      <input ref={ref} type="checkbox" {...rest} />
      {label}
    </label>
  );
})

export default Checkbox;

export const OutlinedCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(function BigCheckbox(props, ref) {
  const { className, ...rest } = props;

  return (
    <Checkbox ref={ref} className={classNames(styles.bigCheckbox, className)} square={20} {...rest}/>
  );
});
