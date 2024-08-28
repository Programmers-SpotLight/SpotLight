import axios from "axios";
import { requestHandler } from "./http";
import { QUERY_STRING_NAME } from "@/constants/queryString.constants";

interface IFetchReviewsParams {
  reviewType: "selection" | "spot";
  sltOrSpotId: number | string;
}

interface IFetchReviews extends IFetchReviewsParams {
  sort: string;
  page: number;
}

interface IReviewFormDataCreate extends IReviewFormData, IFetchReviewsParams {}
interface IReviewFormDataUpdate extends IReviewFormData, IFetchReviewsParams {
  reviewId: string;
}
interface IReviewFormDataDelete {
  reviewId: string;
  reviewType: "selection" | "spot";
  sltOrSpotId: number | string;
}

export const fetchReviews = async ({
  reviewType,
  sltOrSpotId,
  sort,
  page = 1
}: IFetchReviews) => {
  const url =
    reviewType === "selection"
      ? `/api/selections/${sltOrSpotId}/reviews?page=${page}&sort=${sort}`
      : `/api/selections/spots/${sltOrSpotId}/reviews?page=${page}&sort=${sort}`;

  return await requestHandler("get", url);
};

export const fetchReviewsInfo = async ({
  reviewType,
  sltOrSpotId
}: IFetchReviewsParams): Promise<IReviewsInfo> => {
  const url =
    reviewType === "selection"
      ? `/api/selections/${sltOrSpotId}/reviews/reviews-info`
      : `/api/selections/spots/${sltOrSpotId}/reviews/reviews-info`;

  return await requestHandler("get", url);
};

export const fetchReviewsCreate = async ({
  reviewType,
  sltOrSpotId,
  reviewScore,
  reviewDescription,
  reviewImg
}: IReviewFormDataCreate) => {
  const review: IReviewFormData = {
    reviewScore,
    reviewDescription,
    reviewImg
  };

  const url =
    reviewType === "selection"
      ? `/api/selections/${sltOrSpotId}/reviews`
      : `/api/selections/spots/${sltOrSpotId}/reviews`;

  return await requestHandler("post", url, review);
};

export const fetchReviewsUpdate = async ({
  reviewId,
  reviewType,
  sltOrSpotId,
  reviewScore,
  reviewDescription,
  reviewImg
}: IReviewFormDataUpdate) => {
  const review: IReviewFormData = {
    reviewScore,
    reviewDescription,
    reviewImg
  };

  const url =
    reviewType === "selection"
      ? `/api/selections/${sltOrSpotId}/reviews/${reviewId}`
      : `/api/selections/spots/${sltOrSpotId}/reviews/${reviewId}`;

  return await requestHandler("put", url, review);
};

export const fetchReviewsDelete = async ({
  reviewId,
  reviewType,
  sltOrSpotId
}: IReviewFormDataDelete) => {
  const url =
    reviewType === "selection"
      ? `/api/selections/${sltOrSpotId}/reviews/${reviewId}`
      : `/api/selections/spots/${sltOrSpotId}/reviews/${reviewId}`;

  return await requestHandler("delete", url);
};

export const fetchReviewLike = async (
  selectionId: number,
  reviewId: string,
  spotId: string | null
) => {
  const url = spotId
    ? `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`
    : `/api/selections/${selectionId}/reviews/${reviewId}/likes`;

  return await requestHandler("get", url);
};

export const addReviewLike = async (
  selectionId: number,
  reviewId: string,
  spotId: string | null
): Promise<IReviewLikeData> => {
  try {
    const url = spotId
      ? `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`
      : `/api/selections/${selectionId}/reviews/${reviewId}/likes`;

    const result = await requestHandler("post", url, {
      reviewId,
      reviewType: spotId ? "spot" : "selection"
    });
    return result.data;
  } catch (error) {
    throw new Error("Failed to add review like");
  }
};

export const removeReviewLike = async (
  selectionId: number,
  reviewId: string,
  spotId: string | null
): Promise<IReviewLikeData> => {
  try {
    const url = spotId
      ? `/api/selections/${selectionId}/spots/${spotId}/reviews/${reviewId}/likes`
      : `/api/selections/${selectionId}/reviews/${reviewId}/likes`;

    const result = await axios.delete(url, {
      data: {
        reviewId,
        reviewType: spotId ? "spot" : "selection"
      }
    });
    return result.data.data;
  } catch (error) {
    throw new Error("Failed to remove review like");
  }
};

export const fetchMyReview = async (reviewType: ReviewType, page: string) => {
  const url = `/api/users/reviews/${reviewType}s`;

  const params = new URLSearchParams();
  if (page) params.append(QUERY_STRING_NAME.page, page);

  const finalUrl = `${url}?${params.toString()}`;

  return await requestHandler("get", finalUrl);
};
