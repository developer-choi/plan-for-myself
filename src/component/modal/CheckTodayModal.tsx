import styled from 'styled-components';
import Modal from '@component/modal/Modal';
import type {EssentialModalProp} from '@store/reducers/modal';
import Button from '@component/common/button';
import React from 'react';
import {ModalButtonWrap, ModalHeading} from '@component/modal/GoalModal';
import {useCheckGoalListForm} from '@util/sevices/check-goal';
import {numberWithComma} from '@util/extend/number';

export interface CheckTodayModalProp extends EssentialModalProp {

}

export default function CheckTodayModal({closeModal}: CheckTodayModalProp) {
  const formResult = useCheckGoalListForm({closeModal});

  if (!formResult) {
    return null;
  }

  const {formSubmit, submitDisabled, radioList, submittedDate} = formResult;

  return (
    <StyledModal closeModal={closeModal} disableEasilyClose>
      <ModalHeading>목표 체크리스트</ModalHeading>
      <StyledForm onSubmit={formSubmit}>
        {radioList.map(({props, title, price, checked, content}) => (
          <GoalItem key={props.value}>
            <CustomCheckbox>
              <input type="checkbox" {...props}/>
              {title}
              <Price className={checked ? 'positive' : 'negative'}>{`${checked ? '+' : '-'}${numberWithComma(price)}`}원</Price>
            </CustomCheckbox>
            {!content ? null : <Content>{content}</Content>}
          </GoalItem>
        ))}
        {!submitDisabled ? null : (
          <div>
            제출시각 : {submittedDate}
          </div>
        )}
        <ModalButtonWrap>
          <Button className="gray" onClick={closeModal}>취소</Button>
          <Button disabled={submitDisabled} type="submit">제출</Button>
        </ModalButtonWrap>
      </StyledForm>
    </StyledModal>
  );
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
  width: 100%;
  
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const CustomCheckbox = styled.label`
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;
  
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  border-color: ${props => props.theme.lightMain};
  
  input {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  
  :has(input:checked) {
    border-color: ${props => props.theme.main};
  }
  
  :has(input:disabled) {
    border-color: ${props => props.theme.disabled};
  }
`;

const Price = styled.span`
  margin-left: auto;
  
  &.positive {
    color: blue;
  }
  
  &.negative {
    color: red;
  }
`;

const GoalItem = styled.div`
  width: 100%;
`;

const Content = styled.div`
  margin-top: 6px;
  white-space: pre-line;
  
  border: 1px solid gray;
  border-radius: 4px;
  padding: 8px;
`;
