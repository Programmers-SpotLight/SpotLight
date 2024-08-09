import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchReviews } from "@/http/review.api";

interface IReviewProps {
  reviewType: "selection" | "spot";
  sltOrSpotId: number;
  sort: string;
}

const useReview = ({ 
  reviewType, 
  sltOrSpotId, 
  sort 
}: IReviewProps) => {
  const MAX_RESULT = 5;

  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    hasNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["reviews", sltOrSpotId, sort],
    queryFn: ({ pageParam = 1 }) => fetchReviews({ reviewType, sltOrSpotId, sort, page: pageParam}),
    getNextPageParam: (lastPage, _pages) => {
      if (
        lastPage.pagination.totalCount >
        lastPage.pagination.currentPage * MAX_RESULT
      ) {
        return lastPage.pagination.currentPage + 1;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });

  const allReviews = data?.pages.flatMap(page => page.reviews) || null;

  return {
    reviews: allReviews,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
  };
};

export default useReview;
