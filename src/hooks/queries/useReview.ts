import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviews, fetchReviewsCreate, fetchReviewsDelete, fetchReviewsUpdate } from "@/http/review.api";
import { toast } from "react-toastify";

interface IReviewProps {
  reviewType: "selection" | "spot";
  sltOrSpotId: number | string;
  sort: string;
}

const useReview = ({ 
  reviewType, 
  sltOrSpotId, 
  sort 
}: IReviewProps) => {
  const MAX_RESULT = 5;
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    hasNextPage,
    isFetching,
    refetch
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

  const addReviewMutation = useMutation({
    mutationFn: ({
      reviewScore, 
      reviewDescription, 
      reviewImg
    }: IReviewFormData & { reviewType: string }) => 
      fetchReviewsCreate({ sltOrSpotId, reviewType, reviewScore, reviewDescription, reviewImg }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', sltOrSpotId, sort] });
      toast.success("리뷰가 등록 되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['reviewInfo', reviewType, sltOrSpotId] });
    },
    onError: (error) => {
      toast.error("리뷰 등록에 실패했습니다.");
      console.error('Error creating review:', error);
    }
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({
      reviewId,
      reviewScore, 
      reviewDescription, 
      reviewImg
    }: IReviewUpdateFormData) => 
      fetchReviewsUpdate({ reviewId, sltOrSpotId, reviewType, reviewScore, reviewDescription, reviewImg }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', sltOrSpotId, sort] });
      toast.success("리뷰가 수정 되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['reviewInfo', reviewType, sltOrSpotId] });
    },
    onError: (error) => {
      toast.error("리뷰 수정에 실패했습니다.");
      console.error('Error updating review:', error);
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => fetchReviewsDelete({ reviewId, reviewType, sltOrSpotId }), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', sltOrSpotId, sort] });
      toast.success("리뷰가 삭제 되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['reviewInfo', reviewType, sltOrSpotId] });
    },
    onError: (error) => {
      toast.error("리뷰 삭제에 실패했습니다.");
      console.error('Error deleting review:', error);
    }
  });

  return {
    reviews: allReviews,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
    addReview: addReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
  };
};

export default useReview;
