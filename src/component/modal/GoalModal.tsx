import Modal from '@component/modal/Modal';
import type {EssentialModalProp} from '@store/reducers/modal';
import styled from 'styled-components';
import React from 'react';
import Button from '@component/common/button';
import {Input, TextArea} from '@component/common/Input';
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
        <TextArea placeholder="내용" {...inputProps.content}/>
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

export const ModalButtonWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  
  margin-top: 10px;
  
  > button {
    flex-grow: 1;
  }
`;
