import Hashtag from "@/components/common/Hashtag";
import OneLineInput from "@/components/common/input/OneLineInput";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import Image from "next/image";
import { useState } from "react";
import { useStore } from "zustand";


const ModalCreateSelectionSpotHashtags = () => {
  const [hashtagInputValue, setHashtagInputValue] = useState<string>('');

  const { 
    addHashtag, 
    deleteHashtag, 
    hashtags 
  } = useStore(useSelectionSpotCreateStore);

  const handleHashtagInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInputValue(e.target.value);
  };

  const handleHashtagInput = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    // 한글 입력시 두 번 입력되는 것을 방지
    if ((e as React.KeyboardEvent).nativeEvent?.isComposing) {
      return;
    }

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

      if (hashtagInputValue.includes(" ")) {
        alert("태그명에 공백이 포함되어 있습니다.");
        return;
      }

      if (hashtagInputValue.length > 40) {
        alert("태그명은 40자 이내로 입력해주세요.");
        return;
      }

      addHashtag(hashtagInputValue);
      setHashtagInputValue("");
    }
  };

  const handleDeleteHashtagClick = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const tag = e.currentTarget.parentElement?.textContent;
    if (tag) {
      deleteHashtag(tag);
    }
  }

  return (
    <div>
      <p className='mt-8 font-bold text-medium mb-4'>태그 등록</p>
      <div className="flex flex-col gap-4 w-full items-stretch">
        <div className='relative w-full'>
          <OneLineInput
            placeholder="태그명을 입력해주세요" 
            id="title" 
            name="title"
            isError={false}
            width='w-full'
            value={hashtagInputValue}
            onChange={handleHashtagInputValueChange}
            onKeyDown={handleHashtagInput}
          />
          <button 
            className='absolute top-[50%] right-[1%] transform -translate-y-1/2'
            onClick={handleHashtagInput}
          >
            <Image 
              src="/icons/add_7C7C7C.svg" 
              width={32} 
              height={32} 
              alt="add-spot" 
            />
          </button>
        </div>
        <div className="text-small">
          <p className="text-grey4">해시태그는 총 8개까지 등록 가능합니다</p>
          <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
          {hashtags.map((tag, index) => (
            <li key={index} className="list-none">
              <Hashtag 
                size="big" 
                name={tag} 
                cancelHashtag={handleDeleteHashtagClick} 
              />
            </li>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
};

export default ModalCreateSelectionSpotHashtags;