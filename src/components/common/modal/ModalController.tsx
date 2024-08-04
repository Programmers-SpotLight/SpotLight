"use client";

import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import Modal from "./Modal";
import ModalTemp from "./modal-contents/ModalTemp";
import { TModalSize, TmodalType } from "@/models/modal";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
  component: React.ComponentType<any>;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "temp",
    title: "모달 테스트",
    size: "medium",
    overlayClose: true,
    component: ModalTemp,
  }
];

const ModalController = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, overlayClose, component: Component } = findModal;

  const handleOverlayClick = () => {
    closeModal();
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-20"
      onClick={overlayClose ? handleOverlayClick : undefined}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Modal title={title} size={size} closeModal={closeModal}>
          <Component {...props} />
        </Modal>
      </div>
    </div>
  );
};

export default ModalController;
