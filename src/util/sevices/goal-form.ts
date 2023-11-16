import type {PostGoalRequestParameter} from '@type/goal-server';
import {useCallback} from 'react';
import type {RegisterOptions, SubmitErrorHandler, SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import {GOAL_FREQUENCY_LIST} from '@util/sevices/goal';
import {baseHandleErrors} from '@util/extend/react-hook-form';
import type {GoalModalProp} from '@component/modal/GoalModal';
import {createGoal} from '@util/server/goal';
import type {GoalFrequency} from '@type/goal';

export function useGoalForm({closeModal, data}: GoalModalProp) {
  const {register, handleSubmit} = useForm<GoalFormData>({
    mode: 'all',
    defaultValues: !data ? DEFAULT_FORM_DATA : {
      title: data.title,
      enableContinuous: data.enableContinuous,
      achievePrice: data.achievePrice.toString(),
      notAchievePrice: data.notAchievePrice.toString(),
      frequency: data.frequency
    },
    shouldFocusError: false
  });

  const onError: SubmitErrorHandler<GoalFormData> = useCallback(({title, achievePrice, notAchievePrice}) => {
    baseHandleErrors([title, achievePrice, notAchievePrice])
  }, []);

  const onSubmit: SubmitHandler<GoalFormData> = useCallback(data => {
    createGoal({
      ...data,
      notAchievePrice: Number(data.notAchievePrice),
      achievePrice: Number(data.achievePrice),
      frequency: data.frequency as GoalFrequency
    })
    closeModal()
  }, [closeModal]);
  
  return {
    formSubmit: handleSubmit(onSubmit, onError),
    inputProps: {
      title: register('title', TITLE_OPTIONS),
      achievePrice: register('achievePrice', ACHIEVE_OPTIONS),
      notAchievePrice: register('notAchievePrice'),
      radioList: GOAL_FREQUENCY_LIST.map(frequency => ({
        ...register('frequency'),
        value: frequency,
      })),
      enableContinuous: register('enableContinuous')
    },
    isEdit: !!data
  }
}

const TITLE_OPTIONS: RegisterOptions = {
  required: '제목은 필수입니다.'
}

const ACHIEVE_OPTIONS: RegisterOptions = {
  required: '달성 시 금액은 필수입니다.'
}

export interface GoalFormData extends Record<Exclude<keyof PostGoalRequestParameter, 'enableContinuous'>, string> {
  enableContinuous: boolean
}

const DEFAULT_FORM_DATA: GoalFormData = {
  title: '',
  notAchievePrice: '',
  frequency: 'Daily',
  achievePrice: '',
  enableContinuous: false
}
