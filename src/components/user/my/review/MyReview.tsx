import MyReviewList from "./MyReviewList";

interface MyReviewProps {
  reviewType: ReviewType;
}

const MyReview = ({ reviewType }: MyReviewProps) => {
  return (
    <div>
      <MyReviewList reviewType={reviewType} />
    </div>
  );
};

export default MyReview;