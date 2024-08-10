import React, { Dispatch, SetStateAction, useState } from "react";
import OneLineInput from "../common/input/OneLineInput";
import Hashtag from "../common/Hashtag";
import { MdAdd } from "react-icons/md";

interface ISelectionCreateHashtagsProps {
  hashtags: string[];
  setHashtags: Dispatch<SetStateAction<string[]>>;
}

const SelectionCreateHashtags: React.FC<ISelectionCreateHashtagsProps> = ({
  hashtags,
  setHashtags
}) => {
  const [hashtagInputValue, setHashtagInputValue] = useState<string>("");

  const handleHashtagInput = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e.type === "click" || (e as React.KeyboardEvent).key === "Enter") {
      e.preventDefault();
      if (hashtags.length >= 8) {
        alert("태그는 최대 8개까지 등록 가능합니다.");
        return;
      }
      if (hashtagInputValue === "") {
        alert("태그명을 입력해주세요.");
        return;
      }
      if (hashtags.includes(hashtagInputValue)) {
        alert("이미 등록된 태그입니다.");
        return;
      }

      setHashtags([...hashtags, hashtagInputValue]);
      setHashtagInputValue("");
    }
  };

  const handleDeleteHashtagClick = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const tag = e.currentTarget.parentElement?.textContent;
    if (tag) {
      setHashtags(hashtags.filter((t) => t !== tag));
    }
  };

  const handleHashtagInputValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHashtagInputValue(e.target.value);
  };

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="hashtags" className="w-1/4 text-medium font-bold mt-3">
          태그 등록
        </label>
        <div className="flex flex-col gap-4 w-3/4 items-stretch">
          <div className="relative w-full">
            <OneLineInput
              placeholder="태그명을 입력해주세요"
              id="title"
              name="title"
              isError={false}
              width="w-full"
              value={hashtagInputValue}
              onChange={handleHashtagInputValueChange}
              onKeyDown={handleHashtagInput}
            />
            <button
              className="absolute top-[50%] right-[1%] transform -translate-y-1/2"
              onClick={handleHashtagInput}
            >
            <MdAdd className="w-6 h-6 fill-grey4" />
            </button>
          </div>
          <div className="text-small">
            <p className="text-grey3">해시태그는 총 8개까지 등록 가능합니다</p>
            <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
              {hashtags.map((tag, index) => (
                <li key={index} className="list-none">
                  <Hashtag size="big" name={tag} cancelHashtag={handleDeleteHashtagClick} />
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-grey4 text-small w-1/3 mt-2">
        해시태그를 등록하면 다른 사용자가 키워드 검색을 통해 쉽게 내 셀렉션을
        발견할 수 있어요!
      </p>
    </div>
  );
};

export default SelectionCreateHashtags;
