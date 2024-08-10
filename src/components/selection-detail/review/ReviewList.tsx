import ReviewItem from "./ReviewItem";

interface IReviewListProps {
  sltOrSpotId: number | string;
  reviews: IReview[];
  updateReview: (data: IReviewUpdateFormData) => void;
  deleteReview: (reviewId: string) => void; 
}

const ReviewList = ({ sltOrSpotId, reviews, updateReview, deleteReview }: IReviewListProps) => {
  return (
    <div className="space-y-4">
      {
        reviews.map((review) => (
          <ReviewItem 
            key={review.reviewId} 
            sltOrSpotId={sltOrSpotId} 
            review={review} 
            updateReview={updateReview}
            deleteReview={deleteReview}
          />
        ))
      }
    </div>
  );
};

export default ReviewList;