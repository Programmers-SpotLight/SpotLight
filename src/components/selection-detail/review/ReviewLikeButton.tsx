import { useReviewsLikes } from "@/hooks/queries/useReviewsLikes";
import { useState } from "react";
import { AiFillLike } from "react-icons/ai";

const userId = 1;

interface ILikeButton {
  liked: boolean;
  likeCount: number;
  reviewType: ReviewType;
  sltOrSpotId: string | number;
  reviewId: string;
}

const ReviewLikeButton = ({
  liked,
  likeCount,
  reviewType,
  sltOrSpotId,
  reviewId
}: ILikeButton) => {
  const { 
    addLikeMutate, 
    removeLikeMutate 
  } = useReviewsLikes(
    sltOrSpotId,
    reviewId, 
    reviewType,
    userId
  );

  const likeToggle = async () => {
    try {
      if (liked) {
        removeLikeMutate();
      } else {
        addLikeMutate();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };


  const colorClass = liked ? "text-primary" : "text-grey3";

  return (
    <div
      className={`${colorClass} flex items-center space-x-1 text-bold left-0 `}
    >
      <AiFillLike
        size={15}
        className="cursor-pointer"
        onClick={likeToggle}
      />
      <div className="text-small">{likeCount}</div>
    </div>
  );
};

export default ReviewLikeButton;