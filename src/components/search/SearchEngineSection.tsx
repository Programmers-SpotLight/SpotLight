import React, { useEffect, useState } from "react";
import SearchDropdown from "./SearchDropdown";
import TextInput from "../common/input/TextInput";
import { MdAdd } from "react-icons/md";
import Hashtag from "../common/Hashtag";

const SearchEngineSection = () => {
  const [tagValue, setTagValue] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>([]);

  useEffect(() => {
    const storedTags = sessionStorage.getItem("tags");
    if (storedTags) {
      setTagList(JSON.parse(storedTags));
    }
    updateQueryString(JSON.parse(storedTags || "[]"));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tagValue.trim()) {
      const updatedTagList = [...tagList, tagValue];
      setTagList(updatedTagList);
      setTagValue("");
      sessionStorage.setItem("tags", JSON.stringify(updatedTagList));
      updateQueryString(updatedTagList);
    }
  };

  const cancelHashtag = (index: number) => {
    const updatedTagList = tagList.filter((_, i) => i !== index);
    setTagList(updatedTagList);
    sessionStorage.setItem("tags", JSON.stringify(updatedTagList));
    updateQueryString(updatedTagList)
  };

  const updateQueryString = (tags: string[]) => {
    const queryString = tags.map(tag => `tag=${encodeURIComponent(tag)}`).join('&');
    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.replaceState({}, '', newUrl);
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
              cancelHashtag={() => cancelHashtag(index)}
              name={tag}
              size="big"
            />
          ))
        )}
      </div>
    </div>
  );
};

const CategoryContents = [
  { name: "전체", id: 0 },
  { name: "아이돌", id: 1 },
  { name: "영화", id: 2 },
  { name: "드라마", id: 3 },
  { name: "애니메이션", id: 4 },
  { name: "책", id: 5 },
  { name: "종교", id: 6 }
];

const RegionContents = [
  { name: "전체", id: 0 },
  { name: "서울", id: 1 },
  { name: "경기도", id: 2 },
  { name: "충청도", id: 3 },
  { name: "강원도", id: 4 },
  { name: "경상도", id: 5 },
  { name: "전라도", id: 6 },
  { name: "제주도", id: 7 }
];

export default SearchEngineSection;
