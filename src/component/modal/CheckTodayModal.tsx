import styled from 'styled-components';
import Modal from '@component/modal/Modal';
import type {EssentialModalProp} from '@store/reducers/modal';
import Button from '@component/common/button';
import React from 'react';
import {ModalButtonWrap, ModalHeading} from '@component/modal/GoalModal';

export interface CheckTodayModalProp extends EssentialModalProp {

}

export default function CheckTodayModal({closeModal}: CheckTodayModalProp) {
  const hasChecked = false;
  const frequency = 'all'
  const originalList = hasChecked ? ['checkedGoalList', 1, 2, 3] : ['goalList', 1, 2, 3];
  const goalList = frequency === 'all' ? originalList : originalList.filter(value => value === frequency)

  return (
    <StyledModal closeModal={closeModal} disableEasilyClose>
      <ModalHeading>목표 체크리스트</ModalHeading>
      <StyledForm>
        {goalList.map(value => (
          <CustomCheckbox key={value}>
            <input type="checkbox" disabled={hasChecked}/>
            이거하고 저거하기
          </CustomCheckbox>
        ))}
        {!hasChecked ? null : (
          <div>
            정산 : 000원 / 제출시작 : 00시 00분
          </div>
        )}
        <ModalButtonWrap>
          <Button className="gray" onClick={closeModal}>취소</Button>
          <Button disabled={hasChecked}>제출</Button>
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
`;
