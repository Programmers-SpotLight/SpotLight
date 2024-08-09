import { requestHandler } from "./http";

interface IFetchReviewsParams {
  reviewType: "selection" | "spot";
  sltOrSpotId: number;
}

interface IFetchReviews extends IFetchReviewsParams {
  sort: string;
  page: number;
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

  return await requestHandler('get', url)
};

export const fetchReviewsInfo = async ({ 
  reviewType, 
  sltOrSpotId
}: IFetchReviewsParams): Promise<IReviewsInfo> => {
  const url =
    reviewType === "selection"
    ? `/api/selections/${sltOrSpotId}/reviews/reviews-info`
    : `/api/selections/spots/${sltOrSpotId}/reviews/reviews-info`;

  return await requestHandler('get', url)
};
