'use client';

import ColCard from "@/components/common/card/ColCard";
import Pagination from "@/components/search/Pagination";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString.constants";
import useFetchUserSelectionList from "@/hooks/queries/useFetchUserSelectionList";
import { Ihashtags } from "@/models/hashtag.model";
import { TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const tabDatas: Array<{ title: string; query: TuserSelection }> = [
  {
    title: "작성한 셀렉션",
    query: "my"
  },
  {
    title: "북마크 셀렉션",
    query: "bookmark"
  },
  {
    title: "임시저장 셀렉션",
    query: "temp"
  }
];

const UserSelectionList = () => {
  const [currentSelection, setCurrentSelection] = useState<TuserSelection>("my");
  const searchParams = useSearchParams();
  const userSelectionType = (searchParams.get(QUERY_STRING_NAME.userSelection) as TuserSelection) || QUERY_STRING_DEFAULT.userSelection as TuserSelection
  const sort = (searchParams.get(QUERY_STRING_NAME.sort) as TsortType) || QUERY_STRING_DEFAULT.sort as TsortType;
  const page = searchParams.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page;
  const limit = searchParams.get(QUERY_STRING_NAME.limit) || "9";
  const pathname = usePathname();
  const userIdMatch = pathname.match(/user\/(\d+)/); // 예: "/users/123"에서 "123"을 추출
  if(!userIdMatch) return null;

  const userId = userIdMatch[1];
  const {data : userSelectionList, isLoading, isError} = useFetchUserSelectionList({userId, userSelectionType, sort, page, limit})

  const handleTabData = (tabData : TuserSelection) => {
    setCurrentSelection(tabData)
    deleteQueryString(QUERY_STRING_NAME.userSelection)
    addQueryString(QUERY_STRING_NAME.userSelection, tabData);
  }

  if(!userSelectionList) return null;
  if(isLoading) return <SearchLoading/>
  if(isError) return <div>에러입니다.</div>

  return (
    <div className="mt-10 h-auto m-auto">
      <ul className="list-none flex gap-[20px] text-large font-bold text-grey3 cursor-pointer mb-10">{
        tabDatas.map((tabData)=>(
          <li key={tabData.query} className={currentSelection === tabData.query ? 'text-black font-extrabold' : 'text-grey3'}
          onClick={()=>handleTabData(tabData.query)}
          >{tabData.title}</li>
        ))}

      </ul>
      <div className="grid grid-cols-3 mt-5 gap-[20px]">
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
      <div className="translate-x-[-90px]">
      <Pagination pagination={userSelectionList.pagination}></Pagination>
      </div>
    </div>
  );
};

export default UserSelectionList;
