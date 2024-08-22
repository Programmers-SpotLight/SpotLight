import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchReviewsCreate, fetchReviewsUpdate, fetchReviewsDelete } from "@/http/review.api";

interface IReviewProps {
  reviewType: "selection" | "spot";
  sltOrSpotId: number | string;
  sort: string;
}

export const useReviewMutations = ({ reviewType, sltOrSpotId, sort }: IReviewProps) => {
  const queryClient = useQueryClient();

  const addReviewMutation = useMutation({
    mutationFn: ({ reviewScore, reviewDescription, reviewImg }: IReviewFormData) => 
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
    mutationFn: ({ reviewId, reviewScore, reviewDescription, reviewImg }: IReviewUpdateFormData) => 
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
    },
    retry: 0
  });

  return {
    addReview: addReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
  };
};
