import React from "react";
import SelectionCreateHashtagsList from "./SelectionCreateHashtagsList";
import SelectionCreateHashtagsSuggestionList from "./SelectionCreateHashtagsSuggestionList";
import SelectionCreateHashtagInput from "./SelectionCreateHashtagInput";


const SelectionCreateHashtags : React.FC = () => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start w-2/3">
        <label htmlFor="hashtags" className="w-1/4 text-medium font-bold mt-3">태그 등록</label>
        <div className="flex flex-col gap-4 w-3/4 items-stretch">
          <SelectionCreateHashtagInput />
          <SelectionCreateHashtagsSuggestionList />
          <SelectionCreateHashtagsList />
        </div>
      </div>
      <p className="text-grey4 text-small w-1/3 mt-2 break-keep">
        해시태그를 등록하면 다른 사용자가 키워드 검색을 통해 쉽게 내 셀렉션을
        발견할 수 있어요!
      </p>
    </div>
  );
};

export default SelectionCreateHashtags;
