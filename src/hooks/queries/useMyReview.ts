import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IsearchResult, TsortType } from "@/models/searchResult.model";
import { fetchSearchResult } from "@/http/selectionSearch.api";

interface IMyReviewProps {
  reviewType: ReviewType;
  page : string;
  limit : string;
}

const useMyReview = ({ reviewType, page, limit } : IMyReviewProps) : UseQueryResult<IMyReview> => {
  return useQuery<IsearchResult>({
    queryKey: ['myReview', page, limit],
    queryFn : () => fetchMyReview(reviewType, page, limit)
  })
}

export default useMyReview;