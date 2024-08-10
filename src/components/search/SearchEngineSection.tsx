"use client";

import React, { useEffect, useState, useRef } from "react";
import TextInput from "../common/input/TextInput";
import { MdAdd } from "react-icons/md";
import Hashtag from "../common/Hashtag";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import useFetchSelectionCategories from "@/hooks/queries/useFetchSelectionCategories";
import useFetchSelectionLocations from "@/hooks/queries/useFetchSelectionLocations";
import { QUERY_STRING_NAME } from "@/constants/queryString";
import AutoCompletion from "./search-contents/AutoCompletion";
import { useSearchParams } from "next/navigation";
import useSearchAutoComplete from "@/hooks/useSearchAutoComplete";
import Dropdown from "../common/Dropdown";

const SearchEngineSection = () => {
  const searchParams = useSearchParams();
  const [tagValue, setTagValue] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>([]);
  const {tagInputRef, tagACRef, handleKeyDown, visibleAutoCompletion, setVisibleAutoCompletion} = useSearchAutoComplete();
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
    if (tagInputRef.current) tagInputRef.current?.focus();
    const addtagList = [];
    const HeaderSearchTag = searchParams.get(QUERY_STRING_NAME.tags); // 검색을 통해 접근하는 경우 태그 불러오기
    if (HeaderSearchTag) {
      addtagList.push(HeaderSearchTag);
    }
    const storedTags = sessionStorage.getItem(QUERY_STRING_NAME.tags); // 세션 스토리지에 저장된 태그 불러오기
    if (storedTags) { // 세션에 저장된 데이터가 있는 경우 태그리스트에 추가
      const parseStoredTags = JSON.parse(storedTags);
      parseStoredTags.forEach((tag: string) => {
        addtagList.push(tag);
      });
    }

    if (addtagList.length > 0) { // 태그리스트에 값이 있는 경우 쿼리스트링에 추가
      addtagList.forEach((tag: string) => {
        addQueryString(QUERY_STRING_NAME.tags, tag);
    });
    setTagList(addtagList);
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
      setVisibleAutoCompletion(false);
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
        <Dropdown
          title="카테고리"
          query={QUERY_STRING_NAME.category_id}
          contents={categoryDatas}
        />
        <Dropdown
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
          ref={tagInputRef}
          onChange={(e) => {
            setTagValue(e.target.value);
            setVisibleAutoCompletion(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {visibleAutoCompletion && (
          <AutoCompletion
            tagValue={tagInputRef.current ? tagInputRef.current.value : null}
            setTagValue={setTagValue}
            tagACRef={tagACRef}
            tagInputRef={tagInputRef}
            setVisibleAutoCompletion={setVisibleAutoCompletion}
          />
        )}
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
