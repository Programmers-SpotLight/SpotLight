import ReviewItem from "./ReviewItem";

interface IReviewListProps {
  sltOrSpotId: number | string;
  reviews: IReview[];
  reviewType: ReviewType;
  updateReview: (data: IReviewUpdateFormData) => void;
  deleteReview: (reviewId: string) => void; 
}

const ReviewList = ({ sltOrSpotId, reviews, reviewType, updateReview, deleteReview }: IReviewListProps) => {
  return (
    <div className="space-y-4">
      {
        reviews.map((review) => (
          <ReviewItem 
            key={review.reviewId} 
            sltOrSpotId={sltOrSpotId} 
            review={review} 
            reviewType={reviewType}
            updateReview={updateReview}
            deleteReview={deleteReview}
          />
        ))
      }
    </div>
  );
};

export default ReviewList;
