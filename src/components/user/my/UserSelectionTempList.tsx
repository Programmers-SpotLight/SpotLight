import React from "react";
import { IUserSelectionList } from "./UserSelectionList";
import useFetchUserSelectionList from "@/hooks/queries/useFetchUserSelectionList";
import { ItempResult, ItempSelectionResult } from "@/models/searchResult.model";
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
  if (isLoading) return <SearchLoading />;
  if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!tempSelectionList) return null;

  return (
    <div className="flex flex-col justify-center gap-5">
      {tempSelectionList.data.length > 0 ? (
        <>
          {tempSelectionList.data.map((item, index) => (
            <TempCard key={item.selectionId} {...item} />
          ))}
        </>
      ) : (
        <SearchEmptyResults />
      )}

      <Pagination pagination={tempSelectionList.pagination} />
    </div>
  );
};

export default UserSelectionTempList;
