"use client";

import React, { useRef, useState, useEffect } from "react";
import ColCard from "../common/card/ColCard";
import { useSearchParams } from "next/navigation";
import { FaCaretDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import useClickOutside from "@/hooks/useClickOutside";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import { TsortType } from "@/models/searchResult.model";
import useFetchSearchResult from "@/hooks/queries/useFetchSearchResult";
import Pagination from "./Pagination";
import SearchLoading from "./search-contents/SearchLoading";
import SearchEmptyResults from "./search-contents/SearchEmptyResults";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString.constants";

const sortData: { name: string; type: TsortType }[] = [
  { name: "최신순", type: "latest" },
  { name: "오름차순", type: "asc" },
  { name: "인기순", type: "popular" }
];

const SearchResultSection = () => {
  const searchParams = useSearchParams();
  const [currentSortOption, setCurrentSortOption] = useState<string>("정렬");
  const [isSortClicked, setIsSortClicked] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const tags = searchParams.getAll(QUERY_STRING_NAME.tags);
  const category_id = searchParams.get(QUERY_STRING_NAME.category_id) || QUERY_STRING_DEFAULT.category_id;
  const region_id = searchParams.get(QUERY_STRING_NAME.region_id) || QUERY_STRING_DEFAULT.region_id;
  const sort = (searchParams.get(QUERY_STRING_NAME.sort) as TsortType) || QUERY_STRING_DEFAULT.sort as TsortType;
  const page = searchParams.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page;
  const limit = searchParams.get(QUERY_STRING_NAME.limit) || QUERY_STRING_DEFAULT.limit;

  const { data: results, isError, isLoading } = useFetchSearchResult({category_id, region_id, tags, sort, page, limit});
  useClickOutside(sortRef, setIsSortClicked);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  
  const toggleSortOptions = () => {
    setIsSortClicked((prevState) => !prevState);
  };

  const handleItemClick = (event: React.MouseEvent, name: string, type: TsortType) => {
    event.stopPropagation();
    setCurrentSortOption(name);
    setIsSortClicked(false);
    deleteQueryString("sort");
    addQueryString("sort", type);
  };

  if (isLoading) return <SearchLoading/>
  if (isError) return <div>Error loading results.</div>;
  if (!results) return null;
  if (results.data.length === 0) return <SearchEmptyResults/>

  return (
    <div className="px-5">
      <div
        className="flex justify-end gap-[5px] text-medium text-grey4 mb-5 relative cursor-pointer"
        ref={sortRef}
        onClick={toggleSortOptions}
      >
        <div>{currentSortOption}</div>
        <FaCaretDown className="w-[15px] h-[15px]" />
        {isSortClicked && ( // 정렬 드롭다운 박스
          <div className="absolute translate-x-1 top-full p-[10px] mt-5 bg-white w-[120px] h-[100px] z-10 border-solid border border-grey2 rounded-lg box-border">
            {sortData.map((data, index) => (
              <li
                key={index}
                className="cursor-pointer flex justify-between list-none text-small text-grey4 hover:bg-grey1 p-[6px] rounded-lg"
                onClick={(event) => handleItemClick(event, data.name, data.type)}
              >
                {data.name}
                <MdNavigateNext className="w-[10px] h-[15px] font-bold" />
              </li>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-5">
        {results.data && results.data.map((item) => (
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
      <Pagination pagination={results.pagination}/>
    </div>
  );
};

export default SearchResultSection;
