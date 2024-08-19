import { Ihashtags } from "@/models/hashtag.model";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const useSearchAutoComplete = () => {
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagACRef = useRef<HTMLDivElement>(null);
  const [visibleAutoCompletion, setVisibleAutoCompletion] =
    useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && visibleAutoCompletion && tagACRef.current) {
      e.preventDefault();
      tagACRef.current.focus();
    }
  };

  const searchValidator = (tag: string, hashtags: Ihashtags[] | string[]) => {
    let isDuplicate = false;

    if (typeof hashtags[0] === 'string') {
        isDuplicate = (hashtags as string[]).some(hashtag => hashtag === tag);
    } 
    else if (Array.isArray(hashtags)) {
        isDuplicate = (hashtags as Ihashtags[]).some(hashtag => hashtag.htag_name === tag);
    }

    if (tag.length === 0) {
        toast.error("해시태그를 입력해주세요.");
        return false;
    }
    if (tag.length > 10) {
        toast.error("10글자 이내로 작성해주세요");
        return false;
    }
    if (Array.isArray(hashtags) && hashtags.length >= 8) {
        toast.error("해시태그는 최대 8개까지 등록이 가능합니다");
        return false;
    }
    if (isDuplicate) {
        toast.error("이미 등록된 해시태그입니다.");
        return false;
    }
    return true;
}
    return {tagInputRef, tagACRef, handleKeyDown, visibleAutoCompletion, setVisibleAutoCompletion, searchValidator};
}

export default useSearchAutoComplete;
