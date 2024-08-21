import Button from "../../common/button/Button";
import ReviewAvg from "./ReviewAvg";
import ReviewCount from "./ReviewCount";
import ReviewList from "./ReviewList";
import { useModalStore } from "@/stores/modalStore";
import ReviewEmpty from "./ReviewEmpty";
import ReviewOrderButton from "./ReviewOrderButton";
import { useEffect, useRef, useState } from "react";
import useReview from "@/hooks/queries/useReview";
import ReveiwError from "./ReveiwError";
import Spinner from "@/components/common/Spinner";
import useReviewInfo from "@/hooks/queries/useReviewInfo";
import { useReviewSortContext } from "@/context/useReviewSortContext";
import { useSession } from "next-auth/react";

interface IReviewsProps {
  reviewType: ReviewType;
  sltOrSpotId: number | string;
};

const Review = ({ reviewType, sltOrSpotId } : IReviewsProps) => {
  const { sort } = useReviewSortContext();
  const pageEnd = useRef<HTMLDivElement | null>(null);
  const { openModal } = useModalStore();
  const { data: session, status } = useSession();
  const isLoggedIn = session?.user ? "authenticated" : "unauthenticated";

  const { 
    avg,
    count, 
    loading, 
    error 
  } = useReviewInfo({ reviewType, sltOrSpotId });

  const { 
    reviews,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
    addReview,
    updateReview,
    deleteReview
  } = useReview({ reviewType, sltOrSpotId, sort });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    pageEnd.current && observer.observe(pageEnd.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const openReviewAddModal = () => {
    openModal('review', { onSubmit: addReview }); 
  };

  const handleRetry = () => {
    refetch(); 
  };

  return (
    <div>
      {isLoading ? (
        <Spinner size="small" />
      ) : isError ? (
        <ReveiwError onRetry={handleRetry} />
      ) : (
        reviews && reviews.length !== 0 ? (
          <div className="relative flex-grow overflow-x-visible space-y-3">
            <div className="flex-grow flex items-center justify-center">
              <div className="bg-white border border-solid border-grey2 rounded-lg w-[335px] h-[62px] flex items-center justify-center space-x-16">
                <ReviewAvg avg={avg} />
                <ReviewCount count={count} />
              </div>
            </div>

            <ReviewOrderButton />

            <ReviewList reviewType={reviewType} sltOrSpotId={sltOrSpotId} reviews={reviews} updateReview={updateReview} deleteReview={deleteReview} />

            <div className="p-3" ref={pageEnd}>
              {isFetching && <Spinner size="small" />}
            </div>

            <div className="absolute sticky bottom-4 w-full flex justify-center z-10">
              <Button type="button" onClick={openReviewAddModal} isRequiredAuthCheck={true} authStatus={isLoggedIn}>리뷰 등록하기 +</Button>
            </div>
          </div>
        ) : (
          <ReviewEmpty openModal={openReviewAddModal} />
        )
      )}
    </div>
  );
};

export default Review;