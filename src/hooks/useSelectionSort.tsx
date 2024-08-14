import { useRef, useState } from "react";
import { MdNavigateNext } from "react-icons/md"; // 필요에 따라 아이콘 가져오기
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString"; // 필요에 따라 가져오기
import { TsortType } from "@/models/searchResult.model";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString.constants";

const sortData: { name: string; type: TsortType }[] = [
  { name: "최신순", type: "latest" },
  { name: "오름차순", type: "asc" },
  { name: "인기순", type: "popular" }
];

const useSelectionSort = () => {
  const [isSortClicked, setIsSortClicked] = useState<boolean>(false);
  const [currentSortOption, setCurrentSortOption] = useState<string>("정렬"); // 기본값을 TsortType으로 설정
  const sortRef = useRef<HTMLDivElement>(null);


  const toggleSortOptions = () => {
    setIsSortClicked(prevState => !prevState);
  };

  const handleItemClick = (event: React.MouseEvent<HTMLLIElement>, name: string, type: TsortType) => {
    event.stopPropagation();
    setCurrentSortOption(name);
    setIsSortClicked(false);
    deleteQueryString(QUERY_STRING_NAME.sort);
    addQueryString(QUERY_STRING_NAME.sort, type);
  };

  const sortRender = () => {
    return (
      isSortClicked && (
        <ul className="absolute top-full mt-5 p-2 bg-white w-32 h-auto z-10 border border-solid border-grey2 rounded-lg">
          {sortData.map((data, index) => (
            <li
              key={index}
              className="cursor-pointer flex justify-between items-center list-none text-sm text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
              onClick={(event) => handleItemClick(event, data.name, data.type)}
            >
              {data.name}
              <div className="w-2.5 h-3 font-bold" />
            </li>
          ))}
        </ul>
      )
    );
  };

  return {
    currentSortOption,
    isSortClicked,
    toggleSortOptions,
    handleItemClick,
    setIsSortClicked,
    sortRender,
    sortRef
  };
};

export default useSelectionSort;
