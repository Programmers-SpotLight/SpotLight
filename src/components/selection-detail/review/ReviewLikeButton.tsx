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

  const [checkLiked, setCheckLiked] = useState(liked);
  const [likes, setLikes] = useState(likeCount);

  const likeToggle = async () => {
    try {
      if (checkLiked) {
        setCheckLiked(false);
        setLikes(likes - 1);
        removeLikeMutate();
      } else {
        setCheckLiked(true);
        setLikes(likes + 1);
        addLikeMutate();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  console.log(reviewId, likes)

  const colorClass = checkLiked ? "text-primary" : "text-grey3";

  return (
    <div
      className={`${colorClass} flex items-center space-x-1 text-bold left-0 `}
    >
      <AiFillLike
        size={15}
        className="cursor-pointer"
        onClick={likeToggle}
      />
      <div className="text-small">{likes}</div>
    </div>
  );
};

export default ReviewLikeButton;