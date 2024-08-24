import React from "react";
import { IUserSelectionList } from "./UserSelectionList";
import useFetchUserSelectionList from "@/hooks/queries/useFetchUserSelectionList";
import { ItempResult } from "@/models/searchResult.model";
import TempCard from "@/components/common/card/TempCard";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import Pagination from "@/components/search/Pagination";
import SearchEmptyResults from "@/components/search/search-contents/SearchEmptyResults";

const UserSelectionTempList: React.FC<IUserSelectionList> = ({
  userId,
  userSelectionType,
  sort,
  page,
  limit
}) => {
  const { data, isLoading, isError } = useFetchUserSelectionList({
    userId,
    userSelectionType,
    sort,
    page,
    limit
  });

  const tempSelectionList = data as unknown as ItempResult;
  if (isLoading) return <SearchLoading height="search" />;
  if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!tempSelectionList) return null;

  return (
    <>
      {tempSelectionList.data.length > 0 ? (
        <div className="min-h-[380px] flex flex-col gap-5">
          {tempSelectionList.data.map((item, index) => (
            <TempCard key={item.selectionId} {...item} />
          ))}
        </div>
      ) : (
        <SearchEmptyResults/>
      )}

      <Pagination pagination={tempSelectionList.pagination} />
    </>
  );
};

export default UserSelectionTempList;
