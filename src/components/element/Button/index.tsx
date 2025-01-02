import React, {ComponentPropsWithRef, useCallback, MouseEvent, ComponentPropsWithoutRef} from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import LoadingSpinner from '@/components/element/LoadingSpinner';
import CustomLink, {CustomLinkProps} from '@/components/element/link/CustomLink';

export interface ButtonProps extends Pick<ComponentPropsWithRef<'button'>, UsedProps> {
  size?: ButtonSize; // default 'medium'
  variant?: ButtonVariant; // default 'contained'
  color?: ButtonColor; // default 'primary'
  loading?: boolean;
  isSubmit?: boolean;
}

// Doc: https://docs.google.com/document/d/1aEHPwWUlT8nLpzuJwogzQerYawVbWIk8WCMRaxleDaI/edit
export default function Button(props: ButtonProps) {
  const {
    children,
    isSubmit,
    className,
    type = isSubmit ? 'submit' : 'button',
    loading,
    size = isSubmit ? 'large' : 'medium',
    variant = 'contained',
    color = 'primary',
    onClick,
    ...rest
  } = props;

  const customOnClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      return;
    }

    onClick?.(event);
  }, [loading, onClick]);

  return (
    <button
      type={type}
      className={classNames(styles.button, {[styles.loading]: loading}, styles[size], styles[color], styles[variant], {
        submit: isSubmit,
        className
      })}
      onClick={customOnClick}
      {...rest}
    >
      <div className={classNames(styles.childrenContainer, {[styles.loading]: loading})}>{children}</div>
      {!loading ? null : <LoadingSpinner className={styles.loadingSpinner} square={LINE_HEIGHT_BY_SIZE[size]}/>}
    </button>
  );
}

export type ButtonLinkProps = CustomLinkProps & Pick<ButtonProps, 'variant' | 'size' | 'color'>;

export function ButtonLink({className, size = 'medium', color = 'primary', variant = 'contained', ...rest}: ButtonLinkProps) {
  return (
    <CustomLink
      className={classNames(styles.button, styles[size], styles[color], styles[variant], styles.buttonLink, className)} {...rest}/>
  );
}

export function ImageButton({className, type = 'button', style, ...rest}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button type={type} style={style} className={classNames(styles.imageWrapper, className)} {...rest}/>
  );
}

export function ImageLink({className, style, ...rest}: CustomLinkProps) {
  return (
    <CustomLink style={style} className={classNames(styles.imageWrapper, className)} {...rest}/>
  );
}

// 로딩의 크기는 가로세로 모두 line-height만큼만 커져야 전체 버튼사이즈의 변화가 안생김.
const LINE_HEIGHT_BY_SIZE: Record<ButtonSize, number> = {
  large: 24,
  medium: 20,
  small: 16
};

// 이거 안하면 버튼 컴포넌트 사용할 때 가능한 props 전체 수백개가 뜨기때문에, 사용하는 props만 설정
type UsedProps = 'style' | 'className' | 'onClick' | 'disabled' | 'children' | 'type';
export type ButtonSize = 'medium' | 'large' | 'small';
export type ButtonVariant = 'contained' | 'outlined';
export type ButtonColor = 'primary' | 'secondary' | 'edit' | 'delete' | string;
