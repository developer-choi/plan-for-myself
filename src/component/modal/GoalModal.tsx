import Modal from '@component/modal/Modal';
import type {EssentialModalProp} from '@store/reducers/modal';

export interface GoalModalProp extends EssentialModalProp {

}

export default function GoalModal({closeModal}: GoalModalProp) {
  return (
    <Modal closeModal={closeModal} disableEasilyClose>
      Hello World
    </Modal>
  )
}
