'use client';

import ProcessableRoutineStepCard from '@/components/service/routine/ProcessableRoutineStepCard';
import React, {Fragment, useCallback, useEffect} from 'react';
import {ProcessableRoutine} from '@/types/routine';
import {H1} from '@/components/element/typography';
import Button, {ButtonLink} from '@/components/element/Button';
import {resetRoutineLogsApi} from '@/utils/service/api/routine';
import {useMutation} from '@tanstack/react-query';
import styles from './index.module.scss';
import IconDoubleArrow from '@/components/icon/IconDoubleArrow';
import {BRAND_COLOR, GRAY_COLOR} from '@/styles/color';
import {getProcessingRoutineStepId} from '@/utils/service/constant/routine';
import {scrollToElement} from '@/utils/extend/browser/scroll';
import {useHandleClientSideError} from '@/utils/service/error/client-side';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';

export interface ProcessableRoutinePageProps {
  routine: ProcessableRoutine;
}

export default function ProcessableRoutinePage({routine}: ProcessableRoutinePageProps) {
  const {mutateAsync, isPending} = useMutation({
    mutationFn: resetRoutineLogsApi
  });

  const handleClientSideError = useHandleClientSideError();
  const resetRoutineLogs = useCallback(async () => {
    try {
      await mutateAsync();
      revalidateTagOnServerAction('PROCESSABLE_ROUTINE_LIST');
    } catch (error) {
      handleClientSideError(error);
    }
  }, [handleClientSideError, mutateAsync]);

  useEffect(() => {
    const processingStep = routine.steps.find(step => step.is_processing);

    if (!processingStep) {
      return;
    }

    const selector = getProcessingRoutineStepId(processingStep);
    
    // TODO choose date type 케이스에서 스크롤이 잘 안됨. 애초에 구조를 바꾸든가 timeout주던가 해바야할듯
    if (selector) {
      scrollToElement(`#${selector}`);
    }
  }, [routine]);

  return (
    <>
      <ButtonLink style={{marginBottom: 16}} href="/routine/list" size="large" className="full">루틴 관리</ButtonLink>
      <div className={styles.header}>
        <H1>{routine.title}</H1>
        <ButtonLink href={`/routine/${routine.id}/edit`} color="edit">수정</ButtonLink>
        <Button loading={isPending} color="delete" onClick={resetRoutineLogs}>오늘 루틴 초기화</Button>
      </div>
      <div className={styles.listContainer}>
        {routine.steps.map((step, index) => (
          <Fragment key={step.id}>
            {index === 0 ? null : (
              <IconDoubleArrow className={styles.arrow} width={48} height={48} fill={step.is_processing ? BRAND_COLOR.primary : GRAY_COLOR[4]}/>
            )}
            <ProcessableRoutineStepCard step={step}/>
          </Fragment>
        ))}
      </div>
    </>
  );
}
