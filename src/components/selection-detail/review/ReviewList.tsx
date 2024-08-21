import ReviewItem from "./ReviewItem";

interface IReviewListProps {
  sltOrSpotId: number | string;
  reviews: IReview[];
  reviewType: ReviewType;
}

const ReviewList = ({ sltOrSpotId, reviews, reviewType }: IReviewListProps) => {
  return (
    <div className="space-y-4">
      {
        reviews.map((review) => (
          <ReviewItem 
            key={review.reviewId} 
            sltOrSpotId={sltOrSpotId} 
            review={review} 
            reviewType={reviewType}
          />
        ))
      }
    </div>
  );
};

export default ReviewList;
