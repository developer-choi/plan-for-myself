import Modal from '@component/modal/Modal';
import type {EssentialModalProp} from '@store/reducers/modal';
import styled from 'styled-components';
import React from 'react';
import Button from '@component/common/button';
import Input from '@component/common/Input';
import {HorizontalFieldset} from '@component/common/etc';
import type {Goal} from '@type/goal';
import {useGoalForm} from '@util/sevices/goal-form';

export interface GoalModalProp extends EssentialModalProp {
  data: Goal | undefined
}

export default function GoalModal(props: GoalModalProp) {
  const {inputProps, formSubmit, isEdit} = useGoalForm(props)

  return (
    <StyledModal closeModal={props.closeModal} disableEasilyClose>
      <ModalHeading>목표 {isEdit ? '수정' : '등록'}</ModalHeading>
      <StyledForm onSubmit={formSubmit}>
        <Input placeholder="제목 *" {...inputProps.title}/>
        <Input type="number" placeholder="달성 시 금액 *" {...inputProps.achievePrice}/>
        <Input type="number" placeholder="실패 시 금액" {...inputProps.notAchievePrice}/>
        <HorizontalFieldset>
          {inputProps.radioList.map(props => (
            <label key={props.value}>
              <input type="radio" {...props}/>
              {props.value}
            </label>
          ))}
        </HorizontalFieldset>
        <CheckboxLabel>
          <input type="checkbox" {...inputProps.enableContinuous}/>
          연속 달성 활성화
        </CheckboxLabel>
        {!isEdit ? null : (
          <Warning>
            {'위 항목 중 하나라도 수정할 경우,\n기존 목표와 완전히 다른 목표로 간주함.\n이전 목표는 연속달성 리셋 등의 불이익이 발생할 수 있음.'}
          </Warning>
        )}
        <ModalButtonWrap>
          <Button className="gray" onClick={props.closeModal}>취소</Button>
          <Button onClick={formSubmit}>제출</Button>
        </ModalButtonWrap>
      </StyledForm>
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  padding: 20px;
  width: 100%;
  max-width: 400px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  > *:not(:last-child) {
    margin-bottom: 15px;
  }
  
  > * {
    width: 100%;
  }
`;

export const ModalHeading = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Warning = styled.div`
  white-space: pre-line;
  color: orange;
`;

export const ModalButtonWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  
  margin-top: 10px;
  
  > button {
    flex-grow: 1;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  
  > input {
    margin-right: 4px;
  }
`;
