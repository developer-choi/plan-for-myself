'use client';

import {
  HabitRoutineStep,
  LinkRoutineStep,
  ProcessableRoutineStep,
  ProcessableSleepTimeRoutineStep,
  ProcessableStudiedMinutesRoutineStep,
} from '@/types/routine';
import styles from './index.module.scss';
import {OutlinedCheckbox} from '@/components/form/Checkbox';
import React, {useCallback} from 'react';
import Input from '@/components/form/Input';
import designSystemStyles from '@/styles/design-system.module.scss';
import classNames from 'classnames';
import {Button} from '@forworkchoe/core/components';
import {useMutation} from '@tanstack/react-query';
import {
  postHabitRoutineStepApi,
  postLinkRoutineStepApi,
  postSleepTimeRoutineStepApi,
  postStudiedMinutesRoutineStepApi
} from '@/utils/service/api/routine';
import {useHandleClientSideError} from '@/utils/service/error/client-side';
import {SubmitErrorHandler, SubmitHandler, useForm} from 'react-hook-form';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import {Body2} from '@/components/element/typography';
import {useRouter} from 'next/navigation';
import {getProcessingRoutineStepId} from '@/utils/service/constant/routine';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';
import {isLoadingUntilRefresh} from '@/utils/extend/library/react-query';

export interface ProcessableRoutineStepCardProps {
  step: ProcessableRoutineStep;
}

export default function ProcessableRoutineStepCard({step}: ProcessableRoutineStepCardProps) {
  const id = getProcessingRoutineStepId(step);

  switch (step.type) {
    case 'link':
      return (
        <LinkRoutineCard id={id} step={step}/>
      );

    case 'habit':
      return (
        <HabitRoutineCard id={id} step={step}/>
      );

    case 'studied_minutes':
      return (
        <StudiedMinutesRoutineCard id={id} step={step}/>
      );

    case 'sleep_time':
      return (
        <SleepTimeRoutineCard id={id} step={step}/>
      );
  }
}

export interface SpecificRoutineCardProps <T extends LinkRoutineStep | HabitRoutineStep | ProcessableStudiedMinutesRoutineStep | ProcessableSleepTimeRoutineStep> {
  id: string | undefined;
  step: T & Pick<ProcessableRoutineStep, 'is_processed' | 'is_processing' | 'id'>;
}

function LinkRoutineCard({id, step}: SpecificRoutineCardProps<LinkRoutineStep>) {
  const handleOnClientError = useHandleClientSideError();
  const {disabled, is_processed} = useRoutineState(step);

  const onClick = useCallback(async () => {
    try {
      window.open(step.url);
      await postLinkRoutineStepApi({
        stepId: step.id,
      });
      await revalidateTagOnServerAction('PROCESSABLE_ROUTINE_LIST');
    } catch (error) {
      handleOnClientError(error);
    }
  }, [handleOnClientError, step.id, step.url]);
  
  return (
    <div id={id} className={styles.container}>
      <OutlinedCheckbox checked={is_processed} disabled={disabled} label={step.text} onChange={onClick}/>
      <Dim step={step}/>
    </div>
  );
}

function HabitRoutineCard({id, step}: SpecificRoutineCardProps<HabitRoutineStep>) {
  const handleOnClientError = useHandleClientSideError();
  const {disabled} = useRoutineState(step);
  const {mutateAsync, isSuccess, isPending} = useMutation({
    mutationFn: postHabitRoutineStepApi
  });
  const isLoading = isLoadingUntilRefresh({isSuccess, isPending});
  
  const achieve = useCallback(async (isAchieved: boolean) => {
    try {
      await mutateAsync({
        stepId: step.id,
        isAchieved
      });
      await revalidateTagOnServerAction('PROCESSABLE_ROUTINE_LIST');
    } catch (error) {
      handleOnClientError(error);
    }
  }, [handleOnClientError, mutateAsync, step.id]);

  return (
    <div id={id} className={classNames(styles.container, styles.habit)}>
      <Body2>{step.text}</Body2>
      <Button disabled={disabled} loading={isLoading} size="small" color="secondary" onClick={() => achieve(false)}>미달성</Button>
      <Button disabled={disabled} loading={isLoading} size="small" color="primary" onClick={() => achieve(true)}>달성</Button>
      <Dim step={step}/>
    </div>
  );
}

function StudiedMinutesRoutineCard({id, step}: SpecificRoutineCardProps<ProcessableStudiedMinutesRoutineStep>) {
  const handleOnClientError = useHandleClientSideError();
  const {register, handleSubmit} = useForm<StudiedMinutesFormData>({
    defaultValues: {
      studied_minutes: step.studied_minutes?.toString() ?? ''
    }
  });
  const {disabled, is_processed} = useRoutineState(step);

  const {mutateAsync, isPending, isSuccess} = useMutation({
    mutationFn: postStudiedMinutesRoutineStepApi
  });
  const isLoading = isLoadingUntilRefresh({isSuccess, isPending});

  const onError: SubmitErrorHandler<StudiedMinutesFormData> = useCallback(({studied_minutes}) => {
    baseHandleErrors([studied_minutes]);
  }, []);

  const onSubmit: SubmitHandler<StudiedMinutesFormData> = useCallback(async (data) => {
    if(isLoading) {
      return;
    }
    
    try {
      await mutateAsync({
        stepId: step.id,
        studied_minutes: Number(data.studied_minutes)
      });
      await revalidateTagOnServerAction('PROCESSABLE_ROUTINE_LIST');
    } catch (error: any) {
      handleOnClientError(error);
    }
  }, [isLoading, mutateAsync, step.id, handleOnClientError]);

  return (
    <form id={id} className={classNames(styles.container, designSystemStyles.commonSubForm, 'row')} onSubmit={handleSubmit(onSubmit, onError)}>
      <Input placeholder="studied minutes" disabled={disabled} {...register('studied_minutes')}/>
      {is_processed ? null : (
        <Button loading={isLoading} type="submit">저장</Button>
      )}
      <Dim step={step}/>
    </form>
  );
}

interface StudiedMinutesFormData {
  studied_minutes: string;
}

function SleepTimeRoutineCard({id, step}: SpecificRoutineCardProps<ProcessableSleepTimeRoutineStep>) {
  const handleOnClientError = useHandleClientSideError();
  const {register, handleSubmit} = useForm<SleepTimeFormData>({
    defaultValues: {
      sleep_time: step.sleep_time
    }
  });
  const {disabled, is_processed} = useRoutineState(step);

  const {isSuccess, isPending, mutateAsync} = useMutation({
    mutationFn: postSleepTimeRoutineStepApi
  });
  const isLoading = isLoadingUntilRefresh({isPending, isSuccess});

  const onError: SubmitErrorHandler<SleepTimeFormData> = useCallback(({sleep_time}) => {
    baseHandleErrors([sleep_time]);
  }, []);
  
  const onSubmit: SubmitHandler<SleepTimeFormData> = useCallback(async (data) => {
    if(isLoading) {
      return;
    }
    
    try {
      await mutateAsync({
        stepId: step.id,
        sleep_time: data.sleep_time
      });
      await revalidateTagOnServerAction('PROCESSABLE_ROUTINE_LIST');
    } catch (error: any) {
      handleOnClientError(error);
    }
  }, [handleOnClientError, isLoading, mutateAsync, step.id]);

  // TODO 여기 label, placeholder를 useRoutineForm이랑 같은 로직으로 만들어야하는데...
  return (
    <form id={id} className={classNames(styles.container, designSystemStyles.commonSubForm, 'row')} onSubmit={handleSubmit(onSubmit, onError)}>
      <Input placeholder="sleep time" disabled={disabled} {...register('sleep_time')}/>
      {is_processed ? null : (
        <Button loading={isLoading} type="submit">저장</Button>
      )}
      <Dim step={step}/>
    </form>
  );
}

interface SleepTimeFormData {
  sleep_time: string;
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
function useRoutineState({is_processing, is_processed}: Pick<ProcessableRoutineStep, 'is_processed' | 'is_processing'>) {
  const {refresh} = useRouter();

  /**
   * 습관 스탭 하나 제출이 성공하면
   * 1. 제출했던 스텝은 is_processed true가 되고 processing이 false가 되며,
   * 2. 그 다음 습관 스탭이 is_processing true가 되야하는데,
   * 이걸 RQ에 저장해서 처리하기엔 현재 스탭과 그 다음 스탭 둘 다 바꾸기 번거로워서 그냥 이거 하나로 퉁치기로 했음.
   */
  const onSuccessProcess = refresh;

  return {
    disabled: is_processed || !is_processing,
    is_processed,
    onSuccessProcess
  };
}

function Dim({step: {is_processing, is_processed}}: {step: Pick<ProcessableRoutineStep, 'is_processed' | 'is_processing'>}) {
  if (is_processing) {
    return null
  }

  return (
    <div className={styles.dim}>{is_processed ? 'Clear' : '이전 스텝을 완료하세요.'}</div>
  );
}
