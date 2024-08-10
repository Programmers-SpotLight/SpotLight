import { requestHandler } from "./http";

interface IFetchReviewsParams {
  reviewType: "selection" | "spot";
  sltOrSpotId: number | string;
}

interface IFetchReviews extends IFetchReviewsParams {
  sort: string;
  page: number;
}

interface IReviewFormDataCreate extends IReviewFormData, IFetchReviewsParams {}
interface IReviewFormDataUpdate extends IReviewFormData, IFetchReviewsParams { reviewId: string; }
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

  return await requestHandler('get', url);
};

export const fetchReviewsInfo = async ({ 
  reviewType, 
  sltOrSpotId
}: IFetchReviewsParams): Promise<IReviewsInfo> => {
  const url =
    reviewType === "selection"
    ? `/api/selections/${sltOrSpotId}/reviews/reviews-info`
    : `/api/selections/spots/${sltOrSpotId}/reviews/reviews-info`;

  return await requestHandler('get', url);
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
  }

  const url =
    reviewType === "selection"
    ? `/api/selections/${sltOrSpotId}/reviews`
    : `/api/selections/spots/${sltOrSpotId}/reviews`;

  return await requestHandler('post', url, review);
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
  }

  const url =
    reviewType === "selection"
    ? `/api/selections/${sltOrSpotId}/reviews/${reviewId}`
    : `/api/selections/spots/${sltOrSpotId}/reviews/${reviewId}`;

  return await requestHandler('put', url, review);
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

  return await requestHandler('delete', url);
};