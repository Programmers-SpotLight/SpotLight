import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  IsearchResult,
  ItempResult,
  TsortType
} from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { getUserSelectionList } from "@/http/user.api";

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
    queryKey: ["searchResult", userId, userSelectionType, sort, page, limit],
    queryFn: () =>
      getUserSelectionList(
        userId,
        userSelectionType,
        sort,
        page,
        limit,
        isMyPage
      )
  });
};

export default useFetchUserSelectionList;
