import ReviewItem from "./ReviewItem";

interface IReviewListProps {
  sltOrSpotId: number;
  reviews: IReview[];
}

const ReviewList = ({ sltOrSpotId, reviews }: IReviewListProps) => {
  return (
    <div className="space-y-4">
      {
        reviews.map((review) => (
          <ReviewItem key={review.reviewId} sltOrSpotId={sltOrSpotId} review={review} />
        ))
      }
    </div>
  );
};

export default ReviewList;