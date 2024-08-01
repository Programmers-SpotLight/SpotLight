"use client";

import { useModalStore } from "@/stores/modalStore";
import React, { ReactNode } from "react";
import { useStore } from "zustand";
import Modal from "./Modal";
import ModalTemp from "./modal-contents/ModalTemp";
import { TModalSize, TmodalType } from "@/models/modal";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  component: ReactNode;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "temp",
    title: "모달 테스트",
    size: "medium",
    component: <ModalTemp />,
  },
];

const ModalController = () => {
  const { isOpen, closeModal, modalType } = useStore(useModalStore);

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, component } = findModal;

  const handleOverlayClick = () => {
    closeModal();
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-20"
      onClick={handleOverlayClick}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Modal title={title} size={size} closeModal={closeModal}>
          {component}
        </Modal>
      </div>
    </div>
  );
};

export default ModalController;
