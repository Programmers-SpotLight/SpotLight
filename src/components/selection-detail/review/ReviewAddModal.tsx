import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import { TModalSize, TmodalType } from "@/models/modal";
import Modal from "@/components/common/modal/Modal";
import TextAreaInput from "@/components/common/input/TextAreaInput";
import PictureInput from "@/components/common/input/PictureInput";
import { FaStar } from "react-icons/fa";
import Button from "@/components/common/button/Button";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "review",
    title: "셀렉션 리뷰 등록",
    size: "medium",
    overlayClose: true,
  }
];

const ReviewAddModal = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, overlayClose } = findModal;

  const handleOverlayClick = () => {
    closeModal();
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-20"
      onClick={overlayClose ? handleOverlayClick : undefined}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Modal title={title} size={size} closeModal={closeModal}>
          <div className="space-y-3">
            <div className="text-medium font-extrabold">셀렉션 리뷰를 등록해주세요.</div>
            <FaStar className="text-yellow-400" size={35} />
            <TextAreaInput height="large" width="medium" placeholder="최소 10자 이상, 최대 100자 이내로 작성하세요." />
            <div className="text-medium font-extrabold">사진 등록(선택)</div>
            <PictureInput inputSize="small" />
            <div className="flex justify-center"><Button type="submit" color="default" disabled>등록</Button></div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ReviewAddModal;