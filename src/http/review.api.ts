import axios from "axios";
import { requestHandler } from "./http";

export const addReviewLike = async (
  selectionId: number,
  reviewId: number,
  spotId: number | null,
  userId: number
) => {
  try {
    const url = spotId
      ? `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`
      : `/api/selections/${selectionId}/reviews/${reviewId}/likes`;

    await requestHandler("post", url, {
      reviewId,
      reviewType: spotId ? "spot" : "selection",
      userId
    });
  } catch (error) {
    throw new Error("Failed to add review like");
  }
};

export const removeReviewLike = async (
  selectionId: number,
  reviewId: number,
  spotId: number | null,
  userId: number
) => {
  try {
    const url = spotId
      ? `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`
      : `/api/selections/${selectionId}/reviews/${reviewId}/likes`;

    await axios.delete(url, {
      data: {
        reviewId,
        reviewType: spotId ? "spot" : "selection",
        userId
      }
    });
  } catch (error) {
    throw new Error("Failed to remove review like");
  }
};
