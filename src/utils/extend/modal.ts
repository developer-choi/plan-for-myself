import {useContext} from 'react';
import {ModalContext} from '@/components/setting/ModalProvider';

//모달을 띄우려면 최소한 있어야하는 타입 (store를 통해서 띄우지않고 local state를 통해서 모달을 띄우는 한이 있더라도 이 타입은 반드시 필요함)
export interface EssentialModalProps {
  onClose: () => void;
}

export type CloseModalCallback = EssentialModalProps['onClose'];
type WithoutEssentialModalProp<T> = Omit<T, keyof EssentialModalProps>;

export interface ModalPayload<P extends EssentialModalProps> {
  /**
   * store 통해서 모달 띄울 때 props 타입에는 close callback이 필요하지않음. (provider에서 close props를 전달하기때문)
   * 하지만 Portal에서 모달을 렌더링할때는 close callback이 필요함.
   * store를 통해서던, local state를 통해서건 간에 결과적으로 close props는 전달되야하기때문.
   */
  props: WithoutEssentialModalProp<P>;
  Component: (props: P) => JSX.Element | null;
}

export interface ModalState<P extends EssentialModalProps> {
  /**
   * pk는 모달의 state값에만 존재하고,
   * 실제 모달 컴포넌트의 props에는 전달되지않아야함. (close할때만 필요한 값이기 때문)
   */
  modals: (ModalPayload<P> & {pk: number})[];
  openModal: (param: ModalPayload<P>) => void;
}

// 이 파일은 꼭 ModalProvider 같은 레이아웃 파일과 분리되야함. 안그럼 Modal 컴포넌트들의 css가 두번씩 import됨.
export function useOpenModal() {
  const openModal = useContext(ModalContext).openModal as <P extends EssentialModalProps>(payload: ModalPayload<P>) => void;

  return {
    openModal,
  };
}
