import {type ComponentProps} from 'react';
import {Cross2Icon} from '@radix-ui/react-icons';
import {IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './LoginNudge.module.scss';

interface LoginNudgeProps {
  closeButtonProps: Omit<ComponentProps<'button'>, 'children' | 'className'>;
}

export default function LoginNudge({closeButtonProps}: LoginNudgeProps) {
  return (
    <div className={styles.nudge}>
      <p className={typography.body3}>로그인하지 않으면 기기를 바꾸거나 브라우저 데이터를 지울 때 기록이 사라져요</p>
      <IconButton {...closeButtonProps} className={styles.close} icon={<Cross2Icon />} />
    </div>
  );
}
