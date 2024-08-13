"use client";

import ColCard from "@/components/common/card/ColCard";
import Pagination from "@/components/search/Pagination";
import SearchEmptyResults from "@/components/search/search-contents/SearchEmptyResults";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import {
  QUERY_STRING_DEFAULT,
  QUERY_STRING_NAME
} from "@/constants/queryString.constants";
import { userSelectiontabDatas } from "@/constants/selection.constants";
import useFetchUserSelectionList from "@/hooks/queries/useFetchUserSelectionList";
import useClickOutside from "@/hooks/useClickOutside";
import useSelectionSort from "@/hooks/useSelectionSort";
import { TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const UserSelectionList = () => {
  const [currentSelection, setCurrentSelection] =
    useState<TuserSelection>("my");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userIdMatch = pathname.match(/user\/(\d+)/);

  if (!userIdMatch) return null;
  const userId = userIdMatch[1];

  const userSelectionType =
    (searchParams.get(QUERY_STRING_NAME.userSelection) as TuserSelection) ||
    (QUERY_STRING_DEFAULT.userSelection as TuserSelection);
  const sort =
    (searchParams.get(QUERY_STRING_NAME.sort) as TsortType) ||
    (QUERY_STRING_DEFAULT.sort as TsortType);
  const page =
    searchParams.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page;
  const limit =
    searchParams.get(QUERY_STRING_NAME.limit) ||
    QUERY_STRING_DEFAULT.userSelection_limit;

  const {
    setIsSortClicked,
    toggleSortOptions,
    currentSortOption,
    sortRender,
    sortRef
  } = useSelectionSort();
  useClickOutside(sortRef, () => setIsSortClicked(false));

  const {
    data: userSelectionList,
    isLoading,
    isError
  } = useFetchUserSelectionList({
    userId,
    userSelectionType,
    sort,
    page,
    limit
  });

  const handleTabData = (tabData: TuserSelection) => {
    setCurrentSelection(tabData);
    deleteQueryString(QUERY_STRING_NAME.userSelection);
    addQueryString(QUERY_STRING_NAME.userSelection, tabData);
  };

  if (isError) return <div>에러입니다.</div>;

  return (
    <div className="w-full mt-10 h-auto m-auto p-[20px] box-border">
      <ul className="list-none flex gap-[20px] text-large font-bold text-grey3 cursor-pointer mb-10">
        {userSelectiontabDatas.map((tabData) => (
          <li
            key={tabData.query}
            className={
              currentSelection === tabData.query
                ? "text-black font-extrabold"
                : "text-grey3"
            }
            onClick={() => handleTabData(tabData.query)}
          >
            {tabData.title}
          </li>
        ))}
      </ul>
      <div
        className="flex justify-end gap-[5px] text-medium text-grey4 mb-5 relative cursor-pointer"
        ref={sortRef}
        onClick={toggleSortOptions}
      >
        <div>{currentSortOption}</div>
        <FaCaretDown className="w-[15px] h-[15px]" />
        {sortRender()}
      </div>
      {isLoading || !userSelectionList ? (
        <SearchLoading />
      ) : (
        <>
          {userSelectionList.data.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-[20px]">
                {userSelectionList.data.map((item) => (
                  <ColCard
                    key={item.slt_id}
                    thumbnail={item.slt_img}
                    category={item.slt_category_name}
                    region={item.slt_location_option_name}
                    selectionId={item.slt_id}
                    hashtags={item.slt_hashtags}
                    description={item.slt_description}
                    title={item.slt_title}
                    userName={item.user_nickname}
                    userImage={item.user_img}
                    status={item.slt_status}
                  />
                ))}
              </div>
              <Pagination
                pagination={userSelectionList.pagination}
              ></Pagination>
            </>
          ) : (
            <SearchEmptyResults />
          )}
        </>
      )}
    </div>
  );
};

export default UserSelectionList;
