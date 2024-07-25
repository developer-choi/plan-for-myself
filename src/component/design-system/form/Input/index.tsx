import {FormElementWrapper, FormElementWrapperProps} from '@/component/design-system/form/form-elements';
import classNames from 'classnames';
import {ComponentPropsWithRef, forwardRef, MouseEvent, ReactNode, Ref, useCallback} from 'react';
import styles from './index.module.scss';

export interface InputProps extends ComponentPropsWithRef<"input">, Omit<FormElementWrapperProps, "kind"> {
  rightRender?: ReactNode; // 주로 아이콘 (패스워드 인풋의 eye 아이콘 등)
  hiddenErrorMessage?: boolean; // 에러테두리는 표시하고싶은데 에러메시지는 미노출하고싶은 경우 전달 (ex: 주소폼처럼 여러개의 <Input이 셋트로 나오는 경우)
}

export default forwardRef(function Input({label, error, rightRender, style, className, hiddenErrorMessage, disabled, ...rest}: InputProps, ref: Ref<HTMLInputElement>) {
  const onClickCapture = useCallback((event: MouseEvent<HTMLInputElement>) => {
    if (disabled) {
      event.stopPropagation();
    }
  }, [disabled]);

  return (
    <FormElementWrapper style={style} className={className} label={label} error={hiddenErrorMessage ? undefined : error}>
      {/* <Input은 완전 커스텀하려면 이렇게 div 한번 더 (총 2번) 감싸는게 맞음. 아이콘까지 잘 노출시키면서, 최대치로 입력했을 때 아이콘 안가리게 해야해서. */}
      <div className={classNames(styles.innerContainer, {[styles.error]: error})} onClickCapture={onClickCapture}>
        <input ref={ref} className={styles.input} disabled={disabled} {...rest} />
        {rightRender}
      </div>
    </FormElementWrapper>
  );
});
