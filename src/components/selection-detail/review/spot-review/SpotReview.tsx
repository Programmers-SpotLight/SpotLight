import React from "react";
import ReviewAvg from "../ReviewAvg";
import ReviewCount from "../ReviewCount";
import Button from "@/components/common/button/Button";
import ReviewOrderButton from "../ReviewOrderButton";
import { useModalStore } from "@/stores/modalStore";
import { testData } from "../selection-review/SelectionReview";
import ReviewList from "../ReviewList";
import ReviewEmpty from "../ReviewEmpty";

interface IReviewsProps {
  sltOrSpotId: number;
  reviewType: ReviewType;
}

const SpotReview = ({ sltOrSpotId, reviewType }: IReviewsProps) => {
  const reviewData = testData;

  const { openModal } = useModalStore();

  const openReviewAddModal = () => {
    openModal("review");
  };

  return (
    <div className="relative overflow-y-auto">
      {reviewData ? (
        <div className="relative flex-grow overflow-x-visible space-y-3">
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white border border-solid border-grey2 rounded-lg w-[335px] h-[62px] flex items-center justify-center space-x-16">
              <ReviewAvg avg={reviewData.reviewAvg} />
              <ReviewCount count={reviewData.reviewCount} />
            </div>
          </div>

          <ReviewOrderButton />

          <ReviewList
            sltOrSpotId={sltOrSpotId}
            reviews={reviewData.reviewList}
            reviewType="spot"
          />

          <div className="absolute sticky bottom-4 w-full flex justify-center z-10">
            <Button type="button" onClick={openReviewAddModal}>
              리뷰 등록하기 +
            </Button>
          </div>
        </div>
      ) : (
        <ReviewEmpty />
      )}
    </div>
  );
};

export default SpotReview;
