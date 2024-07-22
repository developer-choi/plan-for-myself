import {ComponentPropsWithoutRef} from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

export default function Button({className, ...rest}: ComponentPropsWithoutRef<'button'>) {
  return (
    <BaseButton className={classNames(styles.button, className)} {...rest}/>
  );
}

export function BaseButton({type = 'button', className, ...rest}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button type={type} className={classNames(styles.baseButton, className)} {...rest}/>
  );
}
