import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyReview, fetchReviewsDelete, fetchReviewsUpdate } from "@/http/review.api";
import { toast } from "react-toastify";
import { QUERY_KEY } from "@/constants/queryKey.constants";

interface IMyReviewProps {
  reviewType: ReviewType;
  page : string;
}

const useMyReview = ({ reviewType, page } : IMyReviewProps) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<IMyReviews>({
    queryKey: ['myReview', reviewType, page],
    queryFn: () => fetchMyReview(reviewType, page)
  });

  const { mutate: updateReviewMutation } = useMutation({
    mutationFn: ({
      reviewId,
      sltOrSpotId,
      reviewScore, 
      reviewDescription, 
      reviewImg
    }: IMyReviewUpdateFormData) => 
      fetchReviewsUpdate({ reviewId, sltOrSpotId, reviewType, reviewScore, reviewDescription, reviewImg }),

    onMutate: async () => {
      const previousReview = queryClient.getQueryData<IMyReviews>(['myReview', reviewType, page]);

      await queryClient.cancelQueries({ queryKey: ['myReview', reviewType, page] });

      return { previousReview };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(['myReview', reviewType, page], context?.previousReview);
      toast.error("리뷰 수정에 실패했습니다.");
      console.error('Error updating review:', error);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReview', reviewType, page] });
      toast.success("리뷰가 수정 되었습니다.");
    }
  });

  const sltOrSpotId = 86;
  const { mutate: deleteReviewMutation } = useMutation({
    mutationFn: (reviewId: string) => 
      fetchReviewsDelete({ reviewId, reviewType, sltOrSpotId }),

    onMutate: async () => {
      const previousReview = queryClient.getQueryData<IMyReviews>(['myReview', reviewType, page]);

      await queryClient.cancelQueries({ queryKey: ['myReview', reviewType, page] });

      return { previousReview };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(['myReview', reviewType, page], context?.previousReview);
      toast.error("리뷰 삭제에 실패했습니다.");
      console.error('Error deleting review:', error);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReview', reviewType, page] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.USERINFO],
        exact: false
      })
      toast.success("리뷰가 삭제 되었습니다.");
    }
  });

  return { data, isLoading, error, updateReviewMutation, deleteReviewMutation };
}

export default useMyReview;