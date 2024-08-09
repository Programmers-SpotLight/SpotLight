import { requestHandler } from "./http";

export const addReviewLike = async (
  selectionId: number,
  reviewId: number,
  spotId: number | null,
  userId: number
) => {
  try {
    if (spotId) {
      await requestHandler(
        "post",
        `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`,
        { reviewId, reviewType: "spot", userId }
      );
    } else {
      await requestHandler(
        "post",
        `/api/selections/${selectionId}/reviews/${reviewId}/likes`,
        { reviewId, reviewType: "selection", userId }
      );
    }
  } catch (error) {
    console.error("Failed to add review like:", error);
  }
};

export const removeReviewLike = async (
  selectionId: number,
  reviewId: number,
  spotId: number | null,
  userId: number
) => {
  try {
    if (spotId) {
      await requestHandler(
        "delete",
        `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`,
        { reviewId, reviewType: "spot", userId }
      );
    } else {
      await requestHandler(
        "delete",
        `/api/selections/${selectionId}/reviews/${reviewId}/likes`,
        { reviewId, reviewType: "selection", userId }
      );
    }
  } catch (error) {
    console.error("Failed to remove review like:", error);
  }
};
