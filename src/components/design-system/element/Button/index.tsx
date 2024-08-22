import React, { ComponentPropsWithRef } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss'
import LoadingSpinner from '@/component/design-system/element/LoadingSpinner';

export interface ButtonProps extends Pick<ComponentPropsWithRef<'button'>, UsedProps> {
  size?: ButtonSize; // default 'medium'
  variant?: ButtonVariant; // default 'contained'
  color?: ButtonColor; // default 'primary'
  loading?: boolean;
}

export default function Button(props: ButtonProps) {
  const { children, className, type = 'button', loading, size = 'medium', variant = 'contained', color = 'primary', ...rest } = props;

  return (
    <button
      type={type}
      className={classNames(styles.button, {[styles.loading]: loading}, styles[size], styles[color], styles[variant], className)}
      {...rest}
    >
      {loading ? <LoadingSpinner className="loading" square={LINE_HEIGHT_BY_SIZE[size]}/> : children}
    </button>
  );
}

// 로딩의 크기는 가로세로 모두 line-height만큼만 커져야 전체 버튼사이즈의 변화가 안생김.
const LINE_HEIGHT_BY_SIZE: Record<ButtonSize, number> = {
  xsmall: 16,
  medium: 20,
  large: 24
}

// 이거 안하면 버튼 컴포넌트 사용할 때 가능한 props 전체 수백개가 뜨기때문에, 사용하는 props만 설정
type UsedProps = "style" | "className" | "onClick" | 'disabled' | 'children' | 'type';
export type ButtonSize = "medium" | "large" | 'xsmall';
export type ButtonVariant = "contained" | "outlined";
export type ButtonColor = 'primary' | 'secondary' | 'edit' | 'delete' | string;
