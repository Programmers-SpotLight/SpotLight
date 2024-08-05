"use client";

import { useModalStore } from "@/stores/modalStore";
import React, { ReactNode } from "react";
import { useStore } from "zustand";
import Modal from "./Modal";
import ModalTemp from "./modal-contents/ModalTemp";
import { TModalSize, TmodalType } from "@/models/modal";
import ModalCreateSelectionSpot from "./modal-contents/ModalCreateSelectionSpot";
import { APIProvider } from "@vis.gl/react-google-maps";

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
  {
    type: "addSelectionSpot",
    title: "스팟 추가",
    size: "large",
    component: (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <ModalCreateSelectionSpot />
      </APIProvider>
    ),
  }
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
