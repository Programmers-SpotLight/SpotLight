import React from "react";
import SearchDropdown from "./SearchDropdown";

const CategoryContents = [
  {
    name: "아이돌",
    id: 1
  },
  {
    name: "영화",
    id: 2
  },
  {
    name: "드라마",
    id: 3
  },
  {
    name: "애니메이션",
    id: 4
  },
  {
    name: "책",
    id: 5
  },
  {
    name: "종교",
    id: 6
  }
];
const SearchEngineSection = () => {
  return (
    <div className="px-5">
      <div className="flex gap-5">
        <SearchDropdown title="카테고리 전체" contents={CategoryContents} />
      </div>
    </div>
  );
};

export default SearchEngineSection;
