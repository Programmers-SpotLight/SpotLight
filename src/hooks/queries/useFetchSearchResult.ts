import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IsearchResult, TsortType } from "@/models/searchResult.model";
import { fetchSearchResult } from "@/http/selectionSearch.api";
import { AxiosError } from "axios";
import { QUERY_KEY } from "@/constants/queryKey.constants";

interface IuseFetchSearchResult {
  category_id?: string;
  region_id?: string;
  tags?: string[];
  sort?: TsortType;
  page?: string;
  limit?: string;
}

const useFetchSearchResult = ({
  category_id,
  region_id,
  tags,
  sort,
  page,
  limit
}: IuseFetchSearchResult): UseQueryResult<IsearchResult> => {
  return useQuery<IsearchResult, AxiosError>({
    queryKey: [
      QUERY_KEY.SELECTION,
      category_id,
      region_id,
      tags,
      sort,
      page,
      limit
    ],
    queryFn: () =>
      fetchSearchResult(category_id, region_id, tags, sort, page, limit),
    staleTime: 300000
  });
};

export default useFetchSearchResult;
