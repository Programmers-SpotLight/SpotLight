import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IsearchResult, TsortType } from "@/models/searchResult.model";
import { fetchSearchResult } from "@/http/search";

const useFetchSearchResult = (category_id : string, region_id : string, tags : string[], sort : TsortType) : UseQueryResult<IsearchResult> => {
    return useQuery<IsearchResult>({
        queryKey: ['searchResult', category_id, region_id, tags, sort],
        queryFn : () => fetchSearchResult(category_id, region_id, tags, sort)
    })
}

export default useFetchSearchResult