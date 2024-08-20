import { useReviewSortContext } from "@/context/useReviewSortContext";
import { addReviewLike, removeReviewLike } from "@/http/review.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface IReviewCash {
  pageParams: number[];
  pages: Array<{ 
    reviews: IReview[]; 
    pagination: { 
      currentPage: number; 
      totalCount: number;
    } 
  }> 
}

export const useReviewsLikes = (
  sltOrSpotId: number | string,
  reviewId: string,
  reviewType: "selection" | "spot",
  userId: number
) => {
  const queryClient = useQueryClient();
  const params = useParams();

  let selectionId: number | null = null;
  let spotId: string | null = null;

  if (reviewType === "selection") {
    selectionId = Number(sltOrSpotId);
  } else {
    selectionId = parseInt(params.selectionId.toString(), 10);
    spotId = sltOrSpotId.toString();
  }

  const { sort } = useReviewSortContext();
  const { mutate: addLikeMutate } = useMutation({
    mutationFn: () => addReviewLike(selectionId, reviewId, spotId, userId),
    
    onMutate: async () => {
      const previousData = queryClient.getQueryData<IReviewCash>(["reviews", sltOrSpotId, sort]);
      const previousPages = previousData?.pages || [];
  
      const updatedPages = previousPages.map(page => ({
        ...page,
        reviews: page.reviews.map(review =>
          review.reviewId === reviewId
            ? { ...review, user: { ...review.user, isLiked: true }, likeCount: review.likeCount + 1 }
            : review
        ),
      }));
  
      await queryClient.cancelQueries({ queryKey: ["reviews", sltOrSpotId, sort] });
  
      queryClient.setQueryData<IReviewCash>(["reviews", sltOrSpotId, sort], {
        pages: updatedPages,
        pageParams: previousData?.pageParams || [], 
      });
  
      return { previousPages };
    },
    
    onError: (error, variables, context) => {
      queryClient.setQueryData(["reviews", sltOrSpotId, sort], {
        pages: context?.previousPages || [],
        pageParams: queryClient.getQueryData<IReviewCash>(["reviews", sltOrSpotId, sort])?.pageParams || [],
      });
      console.error("onError - Error:", error);
    },
    
    onSuccess: (data: IReviewLikeData, variables, context) => {
      const updatedPages = context?.previousPages.map(page => ({
        ...page,
        reviews: page.reviews.map(review =>
          review.reviewId === reviewId
            ? { ...review, user: { ...review.user, isLiked: data.liked }, likeCount: data.likeCount }
            : review
        ),
      }));
  
      queryClient.setQueryData<IReviewCash>(["reviews", sltOrSpotId, sort], {
        pages: updatedPages,
        pageParams: queryClient.getQueryData<IReviewCash>(["reviews", sltOrSpotId, sort])?.pageParams || [],
      });
    }
  });

  const { mutate: removeLikeMutate } = useMutation({
    mutationFn: () => removeReviewLike(selectionId, reviewId, spotId, userId),
    
    onMutate: async () => {
      const previousData = queryClient.getQueryData<IReviewCash>(["reviews", sltOrSpotId, sort]);
      const previousPages = previousData?.pages || [];
  
      const updatedPages = previousPages.map(page => ({
        ...page,
        reviews: page.reviews.map(review =>
          review.reviewId === reviewId
            ? { ...review, user: { ...review.user, isLiked: false }, likeCount: review.likeCount - 1 }
            : review
        ),
      }));

      await queryClient.cancelQueries({ queryKey: ["reviews", sltOrSpotId, sort] });
  
      queryClient.setQueryData<IReviewCash>(["reviews", sltOrSpotId, sort], {
        pages: updatedPages,
        pageParams: previousData?.pageParams || [],
      });
  
      return { previousPages };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData<IReviewCash>(["reviews", sltOrSpotId, sort], {
        pages: context?.previousPages || [],
        pageParams: queryClient.getQueryData<IReviewCash>(["reviews", sltOrSpotId, sort])?.pageParams || [],
      });
      console.error("onError - Error:", error);
    },

    onSuccess: (data: IReviewLikeData, variables, context) => {
      const updatedPages = context?.previousPages.map(page => ({
        ...page,
        reviews: page.reviews.map(review =>
          review.reviewId === reviewId
            ? { ...review, user: { ...review.user, isLiked: data.liked }, likeCount: data.likeCount }
            : review
        ),
      }));

      queryClient.setQueryData<IReviewCash>(["reviews", sltOrSpotId, sort], {
        pages: updatedPages,
        pageParams: queryClient.getQueryData<IReviewCash>(["reviews", sltOrSpotId, sort])?.pageParams || [],
      });
    }
  });


  return { addLikeMutate, removeLikeMutate };
};
