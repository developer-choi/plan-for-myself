import styles from './footer.module.scss';
import classNames from 'classnames';
import React, {ComponentPropsWithoutRef, ReactNode} from 'react';
import Button, {ButtonProps} from '../element/Button';

export type ModalButtonProps = Pick<ButtonProps, 'className' | 'style' | 'children'>;

export interface OneButtonModalFooterProps extends Omit<ModalFooterProps, 'children'> {
  /**
   * 디자인 시스템에서 허용하는 커스텀은, 버튼 텍스트와 클릭 동작 2개입니다.
   * 버튼크기, 버튼사이즈 등은 수정이 허용되지않습니다.
   */
  buttonText: ReactNode;
  onClick: ButtonProps['onClick'];
  buttonType?: ButtonProps['type'];
  loading?: ButtonProps['loading'];
  disabled?: ButtonProps['disabled'];

  /**
   * 하지만 예외케이스가 존재하기때문에, 푸터에서는 수정은 허용하되
   * 푸터를 호출하는 모달 컴포넌트에서는 예외모달이 아니고서야 커스텀 스타일값을 전달하지않는 방향으로 대응하겠습니다.
   */
  customProps?: ModalButtonProps;
}

/**
 * 디자인 시스템에서 허용하는 커스텀은, 버튼 텍스트와 클릭 동작 2개입니다.
 * 버튼크기, 버튼사이즈 등은 수정이 허용되지않습니다.
 * 하지만 예외케이스가 존재하기때문에, 푸터에서는 수정은 허용하되
 * 푸터를 호출하는 모달 컴포넌트에서는 예외모달이 아니고서야 커스텀 스타일값을 전달하지않는 방향으로 대응하겠습니다.
 */
export function OneButtonModalFooter({className, style, onClick, buttonText, buttonType, loading, customProps}: OneButtonModalFooterProps) {
  return (
    <ModalFooter style={style} className={classNames(styles.oneButtonFooter, className)}>
      <Button
        size="large"
        onClick={onClick}
        type={buttonType}
        loading={loading}
        className={customProps?.className}
        style={customProps?.style}
      >
        {customProps?.children ?? buttonText}
      </Button>
    </ModalFooter>
  );
}

export interface TwoButtonsModalFooter extends Omit<ModalFooterProps, 'children'> {
  /**
   * 위에있는 OneButton 주석 참고 부탁드립니다.
   */
  left: {
    buttonText?: ReactNode; // default "취소"
    onClick: ButtonProps['onClick'];
    customProps?: ModalButtonProps;
  };

  right: {
    buttonText?: ReactNode; // default 확인
    onClick: ButtonProps['onClick'];
    disabled?: ButtonProps['disabled'];
    buttonType?: ButtonProps['type'];
    loading?: ButtonProps['loading'];
    customProps?: ModalButtonProps;
  };
}

export function TwoButtonsModalFooter({style, className, left, right}: TwoButtonsModalFooter) {
  return (
    <ModalFooter style={style} className={classNames(styles.twoButtonsFooter, className)}>
      <Button
        size="large"
        variant="outlined"
        onClick={left.onClick}
        className={left.customProps?.className}
        style={left.customProps?.style}
      >
        {left.customProps?.children ?? left.buttonText ?? '취소'}
      </Button>
      <Button
        size="large"
        onClick={right.onClick}
        type={right.buttonType}
        loading={right.loading}
        disabled={right.disabled}
        className={right.customProps?.className}
        style={right.customProps?.style}
      >
        {right.customProps?.children ?? right.buttonText}
      </Button>
    </ModalFooter>
  );
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
type ModalFooterProps = Pick<ComponentPropsWithoutRef<'footer'>, 'className' | 'style' | 'children'>;

// 추후 어떤 푸터가 추가 되더라도, 푸터 껍데기 (하단간격, 좌우간격)는 스타일이 변하지않음.
function ModalFooter({className, ...rest}: ModalFooterProps) {
  return <footer className={classNames(styles.oneButtonFooter, className)} {...rest} />;
}