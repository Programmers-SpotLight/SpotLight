import React from "react";
import SearchDropdown from "./SearchDropdown";

const SearchEngineSection = () => {
  return (
    <div className="px-5">
      <div className="flex gap-5">
        <SearchDropdown title="카테고리" contents={CategoryContents} />
        <SearchDropdown title="지역" contents={RegionContents} />
      </div>
    </div>
  );
};

const CategoryContents = [
  {
    name: "전체",
    id: 0
  },
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

const RegionContents = [
  {
    name: "전체",
    id: 0
  },
  {
    name: "서울",
    id: 1
  },
  {
    name: "경기도",
    id: 2
  },
  {
    name: "충청도",
    id: 3
  },
  {
    name: "강원도",
    id: 4
  },
  {
    name: "경상도",
    id: 5
  },
  {
    name: "전라도",
    id: 6
  },
  {
    name: "제주도",
    id: 6
  },
  {
    name: "전라도",
    id: 6
  }
];

export default SearchEngineSection;
