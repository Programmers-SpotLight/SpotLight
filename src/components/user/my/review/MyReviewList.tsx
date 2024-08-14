import MyReviewItem from "./MyReviewItem";

interface MyReviewProps {
  reviewType: ReviewType;
}

const reviews: IMyReview[] = [
  {
    reviewId: "1",
    sltOrSpotId: 1,
    sltName: "A셀렉션",
    spotName: null,
    reviewDescription: "This is the first review.",
    reviewScore: 4.5,
    updatedDate: new Date().toISOString(),
    likeCount: 10,
  },
  {
    reviewId: "2",
    sltOrSpotId: 2,
    sltName: "B셀렉션",
    spotName: "Spot",
    reviewDescription: "This is the second review.",
    reviewScore: 3.8,
    updatedDate: new Date().toISOString(),
    likeCount: 5,
  },
  {
    reviewId: "3",
    sltOrSpotId: 1,
    sltName: "C셀렉션",
    spotName: null,
    reviewDescription: "This is the third review.",
    reviewScore: 4.2,
    updatedDate: new Date().toISOString(),
    likeCount: 7,
  },
  {
    reviewId: "4",
    sltOrSpotId: 3,
    sltName: "D셀렉션",
    spotName: null,
    reviewDescription: "This is the fourth review.",
    reviewScore: 4.9,
    updatedDate: new Date().toISOString(),
    likeCount: 12,
  }
];


const MyReviewList = ({ reviewType }: MyReviewProps) => {

  return (
    <div className="space-y-2">
      {reviews.map((review) => (
        <MyReviewItem
          key={review.reviewId}
          review={review}
        />
      ))}
    </div>
  );
};

export default MyReviewList;