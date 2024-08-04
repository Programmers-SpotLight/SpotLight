import ReviewItem from "../ReviewItem";

interface ISelectionReviewListProps {
  reviews: ISelectionReview[];
}

const SelectionReviewList = ({ reviews }: ISelectionReviewListProps) => {
  return (
    <div className="space-y-4">
      {
        reviews.map((review) => (
          <ReviewItem key={review.sltReviewId} review={review} />
        ))
      }
    </div>
  );
};

export default SelectionReviewList;