"use client";

import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import Modal from "./Modal";

const ModalController = () => {
  const { modalTitle, modalSize, modalContents, isOpen, closeModal } =
    useStore(useModalStore);

  if (!isOpen) return;

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
      <Modal title={modalTitle} size={modalSize}>
        {modalContents}
      </Modal>
    </div>
  );
};

export default ModalController;
