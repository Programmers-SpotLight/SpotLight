import MyReviewItem from "./MyReviewItem";

interface MyReviewProps {
  reviews: IMyReview[];
  updateReviewMutation: (data: IMyReviewUpdateFormData) => void;
  deleteReviewMutation: (reviewId: string) => void;
}

const MyReviewList = ({ reviews, updateReviewMutation, deleteReviewMutation }: MyReviewProps) => {
  return (
    <div className="flex flex-col justify-center gap-5">
      {reviews.map((review) => (
        <MyReviewItem
          key={review.reviewId}
          review={review}
          updateReviewMutation={updateReviewMutation}
          deleteReviewMutation={deleteReviewMutation}
        />
      ))}
    </div>
  );
};

export default MyReviewList;