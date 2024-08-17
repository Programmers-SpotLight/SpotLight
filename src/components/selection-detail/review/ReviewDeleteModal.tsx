import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import Modal from "@/components/common/modal/Modal";
import Button from "@/components/common/button/Button";
import { TModalSize, TmodalType } from "@/models/modal.model";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "review-delete",
    title: "",
    size: "small",
    overlayClose: false,
  }
];

interface ImodalProps {
  reviewId: string;
  onSubmit: (reviewId: string) => void;
}

const ReviewDeleteModal = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);
  const reviewProps = props as ImodalProps;
  const reviewId = reviewProps?.reviewId;
  const onSubmit = reviewProps?.onSubmit;

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, overlayClose } = findModal;

  const handleOverlayClick = () => {
    closeModal();
  };

  const handleSubmit = () => {
    onSubmit(reviewId);
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
            <div className="flex justify-center text-medium font-extrabold">작성한 리뷰를 정말로 삭제하시겠습니까?</div>
            <div className="flex items-center justify-center text-extraSmall text-grey4">
              삭제 후에는 해당 리뷰의 모든 정보가 영구적으로 제거되며 되돌릴 수 없습니다.
            </div>
            <div className="flex justify-center space-x-2">
              <Button type="button" size="small" color="white" onClick={closeModal}>취소</Button>
              <Button type="submit" size="small" color="primary" onClick={handleSubmit}>삭제</Button>  
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ReviewDeleteModal;