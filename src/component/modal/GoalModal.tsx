import Modal from '@component/modal/Modal';
import type {EssentialModalProp} from '@store/reducers/modal';
import styled from 'styled-components';

export interface GoalModalProp extends EssentialModalProp {

}

export default function GoalModal({closeModal}: GoalModalProp) {
  return (
    <StyledModal closeModal={closeModal} disableEasilyClose>
      <h1>목표 등록 / 수정</h1>
      <input placeholder="제목"/>
      <input placeholder="달성 시 금액"/>
      <label>
        <input type="radio" defaultChecked/>
        Daily
      </label>
      <label>
        <input type="radio"/>
        Weekly
      </label>
      <label>
        <input type="radio"/>
        Monthly
      </label>
      <input placeholder="실패 시 금액"/>
      <div style={{whiteSpace: 'pre-line'}}>
        {'위 항목 중 하나라도 수정할 경우, 기존 목표와 완전히 다른 목표로 간주함.\n이전 목표는 연속달성 리셋 등의 불이익이 발생할 수 있음.'}
      </div>
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  display: flex;
  flex-direction: column;
`;