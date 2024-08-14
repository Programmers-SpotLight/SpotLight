import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IsearchResult, ItempSelectionResult, TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { fetchUserSelectionList } from "@/http/user.api";

interface IuseFetchUserSelectionList {
    userId : string,
    userSelectionType? : TuserSelection,
    limit? : string,
    page? : string,
    sort?: TsortType,

}

const useFetchUserSelectionList = ({userId, userSelectionType, sort, page, limit} : IuseFetchUserSelectionList) : UseQueryResult<IsearchResult | ItempSelectionResult> => {
    return useQuery<IsearchResult>({
        queryKey: ['searchResult', userId, userSelectionType, sort, page, limit],
        queryFn : () => fetchUserSelectionList(userId, userSelectionType, sort, page, limit)
    })
}

export default useFetchUserSelectionList