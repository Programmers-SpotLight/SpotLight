import React, { useState } from "react";
import OneLineInput from "../common/input/OneLineInput";
import Image from "next/image";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";
import SelectionCreateHashtagsList from "./SelectionCreateHashtagsList";
import SelectionCreateHashtagsListItem from "./SelectionCreateHashtagsListItem";
import SelectionCreateHashtagsSuggestionList from "./SelectionCreateHashtagsSuggestionList";


const SelectionCreateHashtags : React.FC = () => {
  const [ hashtagInputValue, setHashtagInputValue ] = useState<string>("");
  const { hashtags, addHashtag } = useStore(useSelectionCreateStore);

  const handleHashtagInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInputValue(e.target.value);
  };

  const handleAddHashtagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hashtags.length >= 8) {
      alert('태그는 최대 8개까지 등록 가능합니다.');
      return;
    }

    if (hashtagInputValue === "") {
      alert('태그명을 입력해주세요.');
      return;
    }

    if (hashtags.includes(hashtagInputValue)) {
      alert('이미 등록된 태그입니다.');
      return;
    }

    if (hashtagInputValue.includes(" ")) {
      alert('태그명에 공백이 포함되어 있습니다.');
      return;
    }

    addHashtag(hashtagInputValue);
    setHashtagInputValue("");
  };

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start w-2/3">
        <label htmlFor="hashtags" className="w-1/4 text-medium font-bold mt-3">태그 등록</label>
        <div className="flex flex-col gap-4 w-3/4 items-stretch">
          <div className='relative w-full'>
            <OneLineInput 
              placeholder="태그명을 입력해주세요" 
              id="title" 
              name="title"
              isError={false}
              width='w-full'
              value={hashtagInputValue}
              onChange={handleHashtagInputValueChange}
            />
            <button 
              className='absolute top-[50%] right-[1%] transform -translate-y-1/2'
              onClick={handleAddHashtagClick}
            >
              <Image 
                src="/icons/add_7C7C7C.svg" 
                width={32} 
                height={32} 
                alt="add-spot" 
              />
            </button>
          </div>
          <SelectionCreateHashtagsSuggestionList />
          <SelectionCreateHashtagsList>
            {hashtags.map((hashtag, index) => (
              <SelectionCreateHashtagsListItem
                key={index}
                hashtag={hashtag}
              />
            ))}
          </SelectionCreateHashtagsList>
        </div>
      </div>
      <p className="text-grey4 text-small w-1/3 mt-2">해시태그를 등록하면 다른 사용자가 키워드 검색을 통해 쉽게 내 셀렉션을 발견할 수 있어요!</p>
    </div>
  );
}

export default SelectionCreateHashtags;