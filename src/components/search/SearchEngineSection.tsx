"use client";

import React, { useEffect, useState, useRef } from "react";
import SearchDropdown from "./search-contents/SearchDropdown";
import TextInput from "../common/input/TextInput";
import { MdAdd } from "react-icons/md";
import Hashtag from "../common/Hashtag";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import useFetchSelectionCategories from "@/hooks/queries/useFetchSelectionCategories";
import useFetchSelectionLocations from "@/hooks/queries/useFetchSelectionLocations";
import { QUERY_STRING_NAME } from "@/constants/queryString";
import AutoCompletion from "./search-contents/AutoCompletion";

const SearchEngineSection = () => {
  const [tagValue, setTagValue] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [visibleAutoCompletion, setVisibleAutoCompletion] = useState<boolean>(false);
  const tagValueRef = useRef<HTMLInputElement>(null);

  const {
    data: categoryDatas,
    isError: categoryError,
    isLoading: categoryLoading
  } = useFetchSelectionCategories();
  const {
    data: locationDatas,
    isError: locationError,
    isLoading: locationLoading
  } = useFetchSelectionLocations();

  useEffect(() => {
    // 초기 컴포넌트 생성 시 세션 스토리지에 저장된 태그 불러오기
    const storedTags = sessionStorage.getItem(QUERY_STRING_NAME.tags);
    if (storedTags) {
      const parseStoredTags = JSON.parse(storedTags);
      setTagList(parseStoredTags);
      parseStoredTags.forEach((tag: string) => {
        addQueryString(QUERY_STRING_NAME.tags, tag);
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tagValue.trim()) {
      const addTag = tagValue.replace(/\s+/g, "");
      const updatedTagList = [...tagList, addTag];
      setTagList(updatedTagList);
      sessionStorage.setItem(
        QUERY_STRING_NAME.tags,
        JSON.stringify(updatedTagList)
      );
      addQueryString(QUERY_STRING_NAME.tags, addTag);
      setVisibleAutoCompletion(false)
      setTagValue("");
    }
  };

  const cancelHashtag = (tag: string, index: number) => {
    const updatedTagList = tagList.filter((_, i) => i !== index);
    setTagList(updatedTagList);
    sessionStorage.setItem(
      QUERY_STRING_NAME.tags,
      JSON.stringify(updatedTagList)
    );
    deleteQueryString(QUERY_STRING_NAME.tags, tag);
  };

  if (!categoryDatas || !locationDatas) return null;

  return (
    <div className="px-5">
      <div className="flex gap-5 mb-5 ">
        <SearchDropdown
          title="카테고리"
          query={QUERY_STRING_NAME.category_id}
          contents={categoryDatas}
        />
        <SearchDropdown
          title="지역"
          query={QUERY_STRING_NAME.region_id}
          contents={locationDatas}
        />
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <TextInput
          width="full"
          height="smallPlus"
          placeholder="태그명을 입력해주세요"
          icon={<MdAdd className="w-6 h-6 fill-grey4" />}
          iconPosition="right"
          value={tagValue}
          ref={tagValueRef}
          onChange={(e) => {setTagValue(e.target.value)
          setVisibleAutoCompletion(true)
          }
          }
        />
        {visibleAutoCompletion && <AutoCompletion tagValue={tagValueRef.current? tagValueRef.current.value : null} setTagValue={setTagValue} setVisibleAutoCompletion={setVisibleAutoCompletion} />}
      </form>
      <div className="flex gap-[5px] flex-wrap mt-[20px]">
        {tagList.length === 0 ? (
          <div className="text-grey3">
            태그명을 입력하면 원하는 셀렉션을 쉽게 찾을 수 있어요
          </div>
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

export default SearchEngineSection;
