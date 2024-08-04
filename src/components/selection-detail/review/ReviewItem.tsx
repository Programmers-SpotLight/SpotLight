import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaStar, FaTrash } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoMdTrash } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import ReviewImages from "./ReviewImages";
import { MdEdit } from "react-icons/md";
import { useModalStore } from "@/stores/modalStore";

interface IReview {
  review: ISelectionReview;
}

const ReviewItem = ({ review }: IReview) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModalStore();
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      return review.stlReviewDescription;
    }
    return review.stlReviewDescription.length > 90 ? review.stlReviewDescription.slice(0, 90) + "..." : review.stlReviewDescription;
  };

  const openReviewAddModal = () => {
    openModal('review'); 
  };

  return (
    <div className="block space-y-3 items-center justify-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {
            review.user.userImage 
            ?
            <div className='w-[38px] h-[38px] bg-grey1 rounded-full flex items-center justify-center'>
              <img src={review.user.userImage} alt="user-image" className="w-[38px] h-[38px] rounded-full" />
            </div>
            : 
            <div className='w-[38px] h-[38px] bg-grey1 rounded-full flex items-center justify-center'>
              <IoPersonSharp size={25} className="text-primary" />
            </div>
          }
          
          <div className="space-y-1 text-small w-[80px] ml-2">
            <div>{review.user.userNickname}</div>
            <div className="text-grey3">{review.sltUpdatedDate}</div>
          </div>
        </div>
        <div className={`${review.user.isLiked ? "text-primary" : "text-grey3"} flex items-center space-x-1 text-bold left-0 `}>
          <AiFillLike size={15} />
          <div className="text-small">{review.likeCount}</div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="flex"> 
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
            key={index}
            className={`text-medium ${
              index < review.sltReviewScore ? "text-yellow-400" : "text-grey2"
            }`}
            />
          ))}
        </div>
        <div className="flex">
          <MdEdit className="cursor-pointer mr-1" onClick={openReviewAddModal} />
          <IoMdTrash className="cursor-pointer" />
        </div>
      </div>

      {review.sltReviewImg && <ReviewImages images={review.sltReviewImg} />}
      
      <div className="text-grey4 text-small">
        {renderText()}
        {review.stlReviewDescription.length > 90 && (
          <button
            onClick={toggleExpand}
          >
            {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ReviewItem;