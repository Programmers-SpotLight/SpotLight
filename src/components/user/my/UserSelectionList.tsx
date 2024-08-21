import ColCard from "@/components/common/card/ColCard";
import Pagination from "@/components/search/Pagination";
import SearchEmptyResults from "@/components/search/search-contents/SearchEmptyResults";
import SearchErrorPage from "@/components/search/search-contents/SearchErrorPage";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import { useUserPage } from "@/context/UserPageContext";
import useFetchUserSelectionList from "@/hooks/queries/useFetchUserSelectionList";
import { IsearchResult, TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { isAxiosError } from "axios";
import React from "react";

export interface IUserSelectionList {
  userId: string;
  userSelectionType: TuserSelection;
  sort: TsortType;
  page: string;
  limit: string;
}

const UserSelectionList: React.FC<IUserSelectionList> = ({
  userId,
  userSelectionType,
  sort,
  page,
  limit
}) => {
  const { isMyPage } = useUserPage();
  const { data, isLoading, isError, error } = useFetchUserSelectionList({
    userId,
    userSelectionType,
    sort,
    page,
    limit,
    isMyPage
  });

  if (isLoading) return <SearchLoading height="search" />;
  if (isError && isAxiosError(error)) return <SearchErrorPage message={error.response?.data.error} />;
  if (!data) return null;
  if (data.data.length === 0) return <SearchEmptyResults />;

  const selectionList = data as unknown as IsearchResult;
  return (
    <>
      <div className="grid grid-cols-3 gap-[20px]">
        {selectionList.data.map((item) => (
          <ColCard key={item.selectionId} {...item} isMyPage={isMyPage} userSelectionType={userSelectionType} />
        ))}
      </div>
      <Pagination pagination={selectionList.pagination} />
    </>
  );
};

export default UserSelectionList;
