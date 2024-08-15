import { TModalSize, TmodalType } from '@/models/modal.model';
import { useModalStore } from '@/stores/modalStore';
import React, { ReactNode } from 'react'
import { useStore } from 'zustand';

export interface ModalUserProps {
  name : string;
  // component : ReactNode
}

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "login",
    title: "",
    size: "small",
    overlayClose: true,
  }
];
const ModalUser = ({name} : ModalUserProps) => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, overlayClose } = findModal;
  
  const handleOverlayClick = () => {
    closeModal();
  };

  return (
    <div onClick={overlayClose ? handleOverlayClick : undefined}>
      {name}
      {/* {component} */}
    </div>
  )
}

export default ModalUser