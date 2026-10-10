'use client';

import type {ReactNode} from 'react';
import classNames from 'classnames';
import type {TooltipRenderProps} from 'react-joyride';
import {Cross2Icon} from '@radix-ui/react-icons';
import {Button, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {DEMO_TOUR_STEP_COUNT_WITH_CHOICE_DIALOG} from '@/demo/demo-tour';
import styles from './TourBubble.module.scss';

interface TourBubbleProps {
  number: number;
  content: ReactNode;
  buttonProps: {
    primary: TooltipRenderProps['primaryProps'];
    close: TooltipRenderProps['closeProps'];
  };
}

export default function TourBubble({number, content, buttonProps}: TourBubbleProps) {
  return (
    <div className={styles.bubble}>
      <IconButton className={styles.close} icon={<Cross2Icon />} {...buttonProps.close} />
      <p className={classNames(typography.body1, typography.bold, styles.text)}>{content}</p>
      <div className={styles.row}>
        <span className={classNames(typography.body3, styles.count)}>
          {number} / {DEMO_TOUR_STEP_COUNT_WITH_CHOICE_DIALOG}
        </span>
        <Button {...buttonProps.primary} />
      </div>
    </div>
  );
}
