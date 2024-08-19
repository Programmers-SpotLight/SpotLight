import Image from "next/image";
import OneLineInput from "../common/input/OneLineInput";
import { useState } from "react";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";
import { toast } from "react-toastify";

const SelectionCreateHashtagInput = () => {
  const [hashtagInputValue, setHashtagInputValue] = useState<string>("");
  const { hashtags, addHashtag } = useStore(useSelectionCreateStore);

  const handleHashtagInputValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setHashtagInputValue(e.target.value);
  };

  const validateHashtag = (hashtag: string) => {
    if (hashtag.length > 40) {
      toast.error("태그명은 40자 이내로 입력해주세요.");
      return false;
    }

    if (hashtag === "") {
      toast.error("태그명을 입력해주세요.");
      return false;
    }

    if (hashtag.includes(" ")) {
      toast.error("태그명에 공백이 포함되어 있습니다.");
      return false;
    }

    if (hashtags.length >= 8) {
      toast.error("태그는 최대 8개까지 등록 가능합니다.");
      return false;
    }

    if (hashtags.includes(hashtag)) {
      toast.error("이미 등록된 태그입니다.");
      return false;
    }

    return true;
  };

  const handleAddHashtagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // 두 번 입력되는 것을 방지
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (validateHashtag(hashtagInputValue)) {
        addHashtag(hashtagInputValue);
        setHashtagInputValue("");
      }
    }
  };

  const handleAddHashtagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateHashtag(hashtagInputValue)) {
      addHashtag(hashtagInputValue);
      setHashtagInputValue("");
    }
  };

  return (
    <div className="relative w-full">
      <OneLineInput
        placeholder="태그명을 입력해주세요"
        id="title"
        name="title"
        isError={false}
        width="w-full"
        value={hashtagInputValue}
        onChange={handleHashtagInputValueChange}
        onKeyDown={handleAddHashtagKeyDown}
      />
      <button
        className="absolute top-[50%] right-[1%] transform -translate-y-1/2"
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
  );
};

export default SelectionCreateHashtagInput;
