import ReviewForm from "@/components/selection-detail/review/ReviewForm";
import { useModalStore } from "@/stores/modalStore";
import React from "react";

interface ImodalProps {
  review: IReview | null;
  sltOrSpotId: number;
  onSubmit: (data: IReviewFormData) => void;
}

const ReviewModal = ({ review, sltOrSpotId, onSubmit }: ImodalProps) => {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleSubmit = (data: IReviewFormData) => {
    const submissionData = review 
    ?
      {
        reviewScore: data.reviewScore,
        reviewDescription: data.reviewDescription,
        reviewImg: data.reviewImg,
        reviewId: review.reviewId,
        sltOrSpotId
      }
    :
      {
        reviewScore: data.reviewScore,
        reviewDescription: data.reviewDescription,
        reviewImg: data.reviewImg,
      };

    onSubmit(submissionData);
    closeModal();
  };
  

  return (
    <ReviewForm 
      review={review} 
      onSubmit={handleSubmit} 
    />
  );
};

export default ReviewModal;
