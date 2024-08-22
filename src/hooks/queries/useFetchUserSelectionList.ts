import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  IsearchResult,
  ItempResult,
  TsortType
} from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { getUserSelectionList } from "@/http/user.api";
import { QUERY_KEY } from "@/constants/queryKey.constants";

interface IuseFetchUserSelectionList {
  userId: string;
  userSelectionType?: TuserSelection;
  limit?: string;
  page?: string;
  sort?: TsortType;
  isMyPage?: boolean;
}

const useFetchUserSelectionList = ({
  userId,
  userSelectionType,
  sort,
  page,
  limit,
  isMyPage
}: IuseFetchUserSelectionList): UseQueryResult<IsearchResult | ItempResult> => {
  return useQuery<IsearchResult | ItempResult>({
    queryKey: [
      QUERY_KEY.SELECTION,
      userId,
      userSelectionType,
      sort,
      page,
      limit
    ],
    queryFn: () =>
      getUserSelectionList(
        userId,
        userSelectionType,
        sort,
        page,
        limit,
        isMyPage
      ),
    staleTime: 300000
  });
};

export default useFetchUserSelectionList;
