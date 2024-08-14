import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useModalStore } from "@/stores/modalStore";

interface IReviewProps {
  review: IMyReview;
}

const user = {
  userId: 1
};

const MyReviewItem = ({ review }: IReviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModalStore();

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

  return (
    <div className="block space-y-3 items-center justify-center p-3">
      <div className="flex items-center justify-between">
        {
          review.spotName 
            ? <div>{review.sltName} / {review.spotName}</div> 
            : <div>{review.sltName}</div>
        }
        
        <div className="flex text-grey4">
          <MdEdit
            className="cursor-pointer mr-1"
            // onClick={openReviewEditModal}
          />
          <IoMdTrash
            className="cursor-pointer"
            // onClick={openReviewDeleteModal}
          />
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

        <div className="flex text-primary">
          <AiFillLike
            size={15}
            className="cursor-pointer"
            />
          <div className="text-small">{review.likeCount}</div>
        </div>    
      </div>

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

export default MyReviewItem;
