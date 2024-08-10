import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoMdTrash } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import ReviewImages from "./ReviewImages";
import { MdEdit } from "react-icons/md";
import { useModalStore } from "@/stores/modalStore";
import { addLike, removeLike } from "@/services/review.services";
import { useReviewsLikes } from "@/hooks/queries/useReviewsLikes";

interface IReviewProps {
  sltOrSpotId: number;
  review: IReview;
  reviewType: ReviewType;
}

const user = {
  userId: 201
};

const ReviewItem = ({ sltOrSpotId, review, reviewType }: IReviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModalStore();

  const { addLikeMutate, removeLikeMutate } = useReviewsLikes(
    sltOrSpotId,
    // 10, // review.reviewId, selection test
    1, //review.reviewId, spot test
    reviewType,
    1 //user.userId
  );

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      return review.reviewDescription;
    }
    return review.reviewDescription.length > 90
      ? review.reviewDescription.slice(0, 90) + "..."
      : review.reviewDescription;
  };

  const openReviewEditModal = () => {
    openModal("review", { review, sltOrSpotId });
  };

  const openReviewDeleteModal = () => {
    openModal("review-delete");
  };

  const toggleLike = () => {
    if (review.user.isLiked) {
      //remove like
      removeLikeMutate();
    } else {
      //add like
      addLikeMutate();
    }
  };

  return (
    <div className="block space-y-3 items-center justify-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {review.user.userImage ? (
            <div className="w-[38px] h-[38px] bg-grey1 rounded-full flex items-center justify-center">
              <img
                src={review.user.userImage}
                alt="user-image"
                className="w-[38px] h-[38px] rounded-full"
              />
            </div>
          ) : (
            <div className="w-[38px] h-[38px] bg-grey1 rounded-full flex items-center justify-center">
              <IoPersonSharp size={25} className="text-primary" />
            </div>
          )}

          <div className="space-y-1 text-small w-[80px] ml-2">
            <div>{review.user.userNickname}</div>
            <div className="text-grey3">{review.updatedDate}</div>
          </div>
        </div>
        <div
          className={`${
            review.user.isLiked ? "text-primary" : "text-grey3"
          } flex items-center space-x-1 text-bold left-0 `}
        >
          <AiFillLike
            size={15}
            className="cursor-pointer"
            onClick={toggleLike}
          />
          <div className="text-small">{review.likeCount}</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex">
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              className={`text-medium ${
                index < review.reviewScore ? "text-yellow-400" : "text-grey2"
              }`}
            />
          ))}
        </div>

        {user.userId === review.user.userId && (
          <div className="flex text-grey4">
            <MdEdit
              className="cursor-pointer mr-1"
              onClick={openReviewEditModal}
            />
            <IoMdTrash
              className="cursor-pointer"
              onClick={openReviewDeleteModal}
            />
          </div>
        )}
      </div>

      {review.reviewImg && <ReviewImages images={review.reviewImg} />}

      <div className="text-grey4 text-small">
        {renderText()}
        {review.reviewDescription.length > 90 && (
          <button onClick={toggleExpand}>
            {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ReviewItem;
