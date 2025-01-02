import React, {ComponentPropsWithRef, forwardRef, PropsWithChildren} from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import RadioIcon from '@/components/icon/RadioIcon';
import {FormElementWrapper, FormElementWrapperProps} from '@/components/form/form-elements';

interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label?: string;
  color?: 'primary' | 'secondary';
}

export type RadioProps = CheckboxProps;

// https://docs.google.com/document/d/1rqmOi11-M61mjOkk5i63SigHNN8BJYLpka8c73tSLb0/edit?usp=drivesdk
export default forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const {label, color = 'primary', style, ...rest} = props;

  return (
    <label style={style} className={classNames(styles.wrapper, styles[color])}>
      <RadioIcon/>
      <input ref={ref} type="radio" {...rest} />
      {label}
    </label>
  );
});

export function RadioGroup(props: PropsWithChildren<FormElementWrapperProps>) {
  const { children, ...rest } = props;

  return (
    <FormElementWrapper {...rest}>
      <div className={styles.radioGroup}>{children}</div>
    </FormElementWrapper>
  );
}
