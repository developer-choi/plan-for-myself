import {ComponentPropsWithoutRef} from 'react';
import styles from './body.module.scss';
import classNames from 'classnames';

// 모달 바디 역시 바뀔 이유가없어보임. 안에 들어가는 컨텐츠만 바뀌지, 모달 바디 패딩 이런건 항상 같을거아냐
export default function DefaultModalBody({className, children, ...rest}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={classNames(styles.bodyPaddingContainer, "bodyPaddingContainer", className)} {...rest}>
      <div className={classNames(styles.bodyScrollContainer, "bodyScrollContainer")}>{children}</div>
    </div>
  );
}
