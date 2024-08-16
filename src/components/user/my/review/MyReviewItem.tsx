import { AiFillLike } from "react-icons/ai";
import { FaStar, FaTrash } from "react-icons/fa";
import { formatDate } from "@/utils/formatDate";
import { useModalStore } from "@/stores/modalStore";

interface IReviewProps {
  review: IMyReview;
  updateReviewMutation: (data: IMyReviewUpdateFormData) => void;
  deleteReviewMutation: (reviewId: string) => void;
}

const MyReviewItem = ({ review, updateReviewMutation, deleteReviewMutation }: IReviewProps) => {
  const { openModal } = useModalStore();
 
  const openReviewEditModal = () => {
    openModal('review',{ review, sltOrSpotId: review.sltOrSpotId, onSubmit: updateReviewMutation });
  };
  
  const openReviewDeleteModal = () => {
    console.log(review.reviewId);
    openModal("review-delete", { reviewId: review.reviewId , onSubmit: deleteReviewMutation });
    return review.reviewDescription.length > 90
      ? review.reviewDescription.slice(0, 90) + "..."
      : review.reviewDescription;
  };

  return (
    <div className="flex gap-5 cursor-pointer">
      <div 
        className="flex-[0.8] w-[700px] h-[100px] p-5 bg-white border border-solid border-grey2 rounded-lg flex flex-col gap-[5px]  hover:scale-105 transition-transform duration-200"
        onClick={openReviewEditModal}
      >
        <div className="flex items-center justify-between">
          <h1 className="w-[400px] font-bold text-medium text-black overflow-hidden overflow-ellipsis line-clamp-1 h-[16px]">
            {
              review.spotName 
                ? <>{review.sltName} / {review.spotName}</>
                  
                : <>{review.sltName}</>
            }
          </h1> 

          <h4 className="font-light text-extraSmall text-grey3">
            {formatDate(review.updatedDate)}
          </h4>
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

          <div className="flex text-primary items-center space-x-1 text-bold left-0">
            <AiFillLike
              size={15}
              className="cursor-pointer"
              />
            <div className="text-small">{review.likeCount}</div>
          </div>    
        </div>

        <div className="text-grey4 text-small w-[570px] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {review.reviewDescription}
        </div>
      </div>
      
      <div 
        className="flex-[0.2] flex items-center justify-center flex-col gap-[5px] text-red-500 cursor-pointer"
        onClick={openReviewDeleteModal}
      >
        <FaTrash />
        <h1>삭제하기</h1>
      </div>
    </div>
  );
};

export default MyReviewItem;
