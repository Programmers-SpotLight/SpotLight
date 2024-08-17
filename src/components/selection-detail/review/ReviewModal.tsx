import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import Modal from "@/components/common/modal/Modal";
import ReviewForm from "./ReviewForm";
import { TModalSize, TmodalType } from "@/models/modal.model";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "review",
    title: "리뷰 등록",
    size: "medium",
    overlayClose: false
  }
];

interface ImodalProps {
  review: IReview | null;
  sltOrSpotId: number;
  onSubmit: (data: IReviewFormData) => void;
}

const ReviewModal = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);
  const reviewProps = props as ImodalProps;
  const review = reviewProps?.review || null;
  const onSubmit = reviewProps?.onSubmit;

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, overlayClose } = findModal;

  const handleCloseModal = () => {
    closeModal();
  };

  const handleSubmit = (data: IReviewFormData) => {
    const submissionData = review 
    ?
      {
        reviewScore: data.reviewScore,
        reviewDescription: data.reviewDescription,
        reviewImg: data.reviewImg,
        reviewId: review ? review.reviewId : undefined
      }
    :
      {
        reviewScore: data.reviewScore,
        reviewDescription: data.reviewDescription,
        reviewImg: data.reviewImg,
      };

    onSubmit(submissionData);
    handleCloseModal();
  };
  

  return (
    <div
      className="w-screen h-screen flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-20"
      onClick={overlayClose ? handleCloseModal : undefined}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Modal title={review ? "리뷰 수정" : title} size={size} closeModal={handleCloseModal}>
          <ReviewForm 
            review={review} 
            onSubmit={handleSubmit} 
          />
        </Modal>
      </div>
    </div>
  );
};

export default ReviewModal;
