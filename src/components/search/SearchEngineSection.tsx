'use client';

import React, { useEffect, useState } from "react";
import SearchDropdown from "./SearchDropdown";
import TextInput from "../common/input/TextInput";
import { MdAdd } from "react-icons/md";
import Hashtag from "../common/Hashtag";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";

const TAG_QUERY_STRING_NAME = "tags"

const SearchEngineSection = () => {
  const [tagValue, setTagValue] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>([]);

  useEffect(() => { // 초기 컴포넌트 생성 시 세션 스토리지에 저장된 태그 불러오기
    const storedTags = sessionStorage.getItem(TAG_QUERY_STRING_NAME);
    if (storedTags) {
      setTagList(JSON.parse(storedTags));
      console.log(setTagList)
    }
  
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // 검색창에 태그 작성후 엔터시 동작, 세션 스토리지에 해당 태그 저장
    e.preventDefault();
    if (tagValue.trim()) {
      const addTag = tagValue.replace(/\s+/g, '');
      const updatedTagList = [...tagList, addTag];
      setTagList(updatedTagList);
      sessionStorage.setItem(TAG_QUERY_STRING_NAME, JSON.stringify(updatedTagList));
      addQueryString(TAG_QUERY_STRING_NAME,addTag);
      setTagValue("");
    }
  };

  const cancelHashtag = (tag : string, index: number) => { // 해시태그 제거시 동작, 세션 스토리지에 해당 태그 제거
    const updatedTagList = tagList.filter((_, i) => i !== index);
    setTagList(updatedTagList);
    sessionStorage.setItem(TAG_QUERY_STRING_NAME, JSON.stringify(updatedTagList));
    deleteQueryString(TAG_QUERY_STRING_NAME,tag)
  };



  return (
    <div className="px-5">
      <div className="flex gap-5 mb-5 ">
        <SearchDropdown title="카테고리" contents={CategoryContents} />
        <SearchDropdown title="지역" contents={RegionContents} />
      </div>
      <form onSubmit={handleSubmit}>
        <TextInput
          width="full"
          height="smallPlus"
          placeholder="태그명을 입력해주세요"
          icon={<MdAdd className="w-6 h-6 fill-grey4" />}
          iconPosition="right"
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
        />
      </form>
      <div className="flex gap-[5px] flex-wrap mt-[20px]">
        {tagList.length === 0 ? (
          <div className="text-grey3">태그명을 입력하면 원하는 셀렉션을 쉽게 찾을 수 있어요</div>
        ) : (
          tagList.map((tag, index) => (
            <Hashtag
              key={index}
              cancelHashtag={() => cancelHashtag(tag, index)}
              name={tag}
              size="big"
            />
          ))
        )}
      </div>
    </div>
  );
};

const CategoryContents = [ // 임시데이터(이후 API를 통해 받을 데이터) 
  { name: "카테고리 전체", id: 0 },
  { name: "아이돌", id: 1 },
  { name: "영화", id: 2 },
  { name: "드라마", id: 3 },
  { name: "애니메이션", id: 4 },
  { name: "책", id: 5 },
  { name: "종교", id: 6 }
];

const RegionContents = [ // 임시데이터(이후 API를 통해 받을 데이터) 
  { name: "지역 전체", id: 0 },
  { name: "서울", id: 1 },
  { name: "경기도", id: 2 },
  { name: "충청도", id: 3 },
  { name: "강원도", id: 4 },
  { name: "경상도", id: 5 },
  { name: "전라도", id: 6 },
  { name: "제주도", id: 7 }
];

export default SearchEngineSection;
