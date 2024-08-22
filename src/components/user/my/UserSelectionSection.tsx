"use client";

import {
  QUERY_STRING_DEFAULT,
  QUERY_STRING_NAME
} from "@/constants/queryString.constants";
import useClickOutside from "@/hooks/useClickOutside";
import useSelectionSort from "@/hooks/useSelectionSort";
import { TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import UserSelectionList from "./UserSelectionList";
import UserSelectionTempList from "./UserSelectionTempList";
import { useUserPage } from "@/context/UserPageContext";

const UserSelectionSection = () => {
  const { isMyPage } = useUserPage();
  const userSelectiontabDatas: Array<{ title: string; query: TuserSelection }> =
    [
      {
        title: "작성한 셀렉션",
        query: "my"
      },
      {
        title: "북마크 셀렉션",
        query: "bookmark"
      },
      ...(isMyPage
        ? [
            {
              title: "임시저장 셀렉션",
              query: "temp" as TuserSelection
            }
          ]
        : [])
    ];
  const { userId, userSelectionType, sort, page, limit } =
    useGetUserSelectionListParams();

  const [currentSelection, setCurrentSelection] = useState<TuserSelection>(
    userSelectionType
      ? userSelectionType
      : (QUERY_STRING_DEFAULT.userSelection as TuserSelection)
  );

  const {
    setIsSortClicked,
    toggleSortOptions,
    currentSortOption,
    sortRender,
    sortRef
  } = useSelectionSort();
  useClickOutside(sortRef, () => setIsSortClicked(false));

  const handleTabData = (tabData: TuserSelection) => {
    setCurrentSelection(tabData);
    deleteQueryString(QUERY_STRING_NAME.userSelection);
    deleteQueryString(QUERY_STRING_NAME.page);
    addQueryString(QUERY_STRING_NAME.userSelection, tabData);
  };

  return (
    <div className="h-auto m-auto px-[20px] box-border w-full w-max-[600px]">
      <ul className="list-none flex gap-[20px] text-large font-bold text-grey3 mb-10">
        {userSelectiontabDatas.map((tabData) => (
          <li
            key={tabData.query}
            className={
              currentSelection === tabData.query
                ? "text-black font-extrabold cursor-pointer "
                : "text-grey3 cursor-pointer "
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
      {userSelectionType === "temp" && isMyPage ? (
        <UserSelectionTempList
          userId={userId}
          userSelectionType={userSelectionType}
          sort={sort}
          page={page}
          limit={limit}
        />
      ) : (
        <UserSelectionList
          userId={userId}
          userSelectionType={userSelectionType}
          sort={sort}
          page={page}
          limit={limit}
        />
      )}
    </div>
  );
};

export default UserSelectionSection;

export const useGetUserSelectionListParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userIdMatch = pathname.match(/user\/(\d+)/);

  const userId = !userIdMatch ? "" : userIdMatch[1];

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

  return { userId, userSelectionType, sort, page, limit };
};
