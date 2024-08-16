import useMyReview from "@/hooks/queries/useMyReview";
import MyReviewItem from "./MyReviewItem";
import { useState } from "react";
import MyReviewPagination from "./MyReviewPagination";
import Spinner from "@/components/common/Spinner";

interface MyReviewProps {
  reviewType: ReviewType;
}


const MySelectionReviewList = ({ reviewType }: MyReviewProps) => {
  const [page, setPage] = useState(1);
  const {
    data, 
    isLoading, 
    error, 
    updateReviewMutation, 
    deleteReviewMutation
  } = useMyReview({reviewType, page: page.toString()});

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  return (
    <>
      {
        isLoading ? (
          <Spinner size="large" /> 
        ) : error ? (
          <div className="text-center text-xl font-semibold text-red-500">
            Error loading reviews
          </div>
        ) : (data && data.reviews.length > 0 ? (
            <div className="flex flex-col justify-center gap-5">
              {data?.reviews.map((review) => (
                <MyReviewItem
                  key={review.reviewId}
                  review={review}
                  updateReviewMutation={updateReviewMutation}
                  deleteReviewMutation={deleteReviewMutation}
                />
              ))}
              {/* <MyReviewPagination
                pagination={data.pagination}
                onPageChange={handlePageChange}
              /> */}
            </div>
          ) : (
            <div className="text-center text-xl font-semibold text-grey4">
              No reviews found
            </div>
          )
        )
      }
    </>
  );
};

export default MySelectionReviewList;