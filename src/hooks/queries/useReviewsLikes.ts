import { addReviewLike, removeReviewLike } from "@/http/review.api";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useReviewsLikes = (
  sltOrSpotId: number | string,
  reviewId: string,
  reviewType: ReviewType,
  userId: number
) => {
  const params = useParams();

  let selectionId: number | null = null;
  let spotId: string | null = null;

  if (reviewType === "selection") {
    selectionId = Number(sltOrSpotId);
  } else {
    selectionId = parseInt(params.selectionId.toString(), 10);
    spotId = sltOrSpotId.toString();
  }

  const { mutate: addLikeMutate } = useMutation({
    mutationKey: [],
    mutationFn: () => addReviewLike(selectionId, reviewId, spotId, userId),
  });

  const { mutate: removeLikeMutate } = useMutation({
    mutationKey: [],
    mutationFn: () => removeReviewLike(selectionId, reviewId, spotId, userId),
  });

  return { addLikeMutate, removeLikeMutate };
};
