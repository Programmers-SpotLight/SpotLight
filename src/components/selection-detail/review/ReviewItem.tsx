import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoMdTrash } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import ReviewImages from "./ReviewImages";
import { MdEdit } from "react-icons/md";
import { useModalStore } from "@/stores/modalStore";
import ReviewLikeButton from "./ReviewLikeButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AiFillLike } from "react-icons/ai";
import { useReviewMutations } from "@/hooks/mutations/useReviewMutations";
import { useReviewSortContext } from "@/context/useReviewSortContext";

interface IReviewProps {
  sltOrSpotId: number | string;
  review: IReview;
  reviewType: ReviewType;
}

const ReviewItem = ({ sltOrSpotId, review, reviewType }: IReviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModalStore();
  const { data: session, status } = useSession();
  const user = session?.user;
  const { sort } = useReviewSortContext();

  const { updateReview, deleteReview } = useReviewMutations({
    reviewType,
    sltOrSpotId,
    sort
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      return (
        <span className="whitespace-pre-wrap">{review.reviewDescription}</span>
      );
    }
    return (
      <span className="whitespace-pre-wrap">
        {review.reviewDescription.length > 90
          ? review.reviewDescription.slice(0, 90) + "..."
          : review.reviewDescription}
      </span>
    );
  };

  const openReviewEditModal = () => {
    openModal("review", { review, sltOrSpotId, onSubmit: updateReview });
  };

  const openReviewDeleteModal = () => {
    openModal("review-delete", {
      reviewId: review.reviewId,
      onSubmit: deleteReview
    });
  };

  return (
    <div className="block space-y-3 items-center justify-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/user/${review.user.userId}`}>
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
          </Link>

          <div className="space-y-1 text-small w-auto ml-2">
            <Link href={`/user/${review.user.userId}`}>
              {review.user.userNickname}
            </Link>
            <div className="text-grey3">{review.createdDate}</div>
          </div>
        </div>

        {review.user.isLiked !== null && user ? (
          <ReviewLikeButton
            liked={review.user.isLiked}
            likeCount={review.likeCount}
            reviewType={reviewType}
            sltOrSpotId={sltOrSpotId}
            reviewId={review.reviewId}
          />
        ) : (
          <div
            className={
              "text-grey3 flex items-center space-x-1 text-bold left-0"
            }
          >
            <AiFillLike size={15} />
            <div className="text-small">{review.likeCount}</div>
          </div>
        )}
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

        {user && user.id === review.user.userId && (
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

      <div className="text-grey4 text-small leading-normal">
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
