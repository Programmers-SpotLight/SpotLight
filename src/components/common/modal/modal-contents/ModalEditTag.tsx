"use client";

import React, { useState, useCallback } from "react";
import TextInput from "../../input/TextInput";
import { FaSearch } from "react-icons/fa";
import Hashtag from "../../Hashtag";
import useSearchAutoComplete from "@/hooks/useSearchAutoComplete";
import { useFetchUserHashtag } from "@/hooks/queries/useFetchUserInfo";
import {
  useAddUserHashtag,
  useDeleteHashtag
} from "@/hooks/queries/useUpdateUserHashtag";
import AutoCompletion from "@/components/search/search-contents/AutoCompletion";
import SearchLoading from "@/components/search/search-contents/SearchLoading";

interface ModalAddTagProps {
  userId: string;
}

const ModalEditTag = ({ userId }: ModalAddTagProps) => {
  const [tagValue, setTagValue] = useState<string>("");
  const {
    tagInputRef,
    tagACRef,
    handleKeyDown,
    visibleAutoCompletion,
    setVisibleAutoCompletion
  } = useSearchAutoComplete();
  const { AddHtag } = useAddUserHashtag(userId);
  const { deleteHtag } = useDeleteHashtag(userId);
  const { data: hashtags, isLoading } = useFetchUserHashtag(userId);

  if (isLoading) return <SearchLoading height="medium"/>
  if (!hashtags || !hashtags.data) return null;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tagValue.trim()) {
        const addTag = tagValue.replace(/\s+/g, "");
        const isDuplicate = hashtags.data.some((hashtag) => hashtag.htag_name === addTag);

        if (addTag.length === 0) {
            return;
        }
        if (addTag.length > 10) {
            alert("10글자 이내로 작성해주세요");
            setTagValue("");
            return;
        }
        if (hashtags?.data.length >= 8) {
            alert("해시태그는 최대 8개까지 등록이 가능합니다");
            setTagValue("");
            return;
        }
        if (isDuplicate) {
            alert("이미 등록된 해시태그입니다.");
            setTagValue("");
            return;
        }
        setTagValue("");
        AddHtag(addTag);
    }
};

  const handleDelete = (userHtagId: number | undefined) => {
    if (userHtagId) deleteHtag(userHtagId);
  };

  return (
    <form className="flex flex-col h-[350px] relative" onSubmit={handleSubmit}>
      <TextInput
        className="text-grey2"
        width="full"
        icon={<FaSearch className="fill-grey3" />}
        placeholder="태그명을 입력해주세요"
        value={tagValue}
        ref={tagInputRef}
        onChange={(e) => {
          setTagValue(e.target.value);
          setVisibleAutoCompletion(true);

        }}
        onKeyDown={handleKeyDown}
      />
      {visibleAutoCompletion && (
        <div className="top-[10px]">
        <AutoCompletion
          tagValue={tagInputRef.current ? tagInputRef.current.value : null}
          setTagValue={setTagValue}
          tagACRef={tagACRef}
          tagInputRef={tagInputRef}
          setVisibleAutoCompletion={setVisibleAutoCompletion}
        />
        </div>
      )}
      <div className="flex-wrap flex list-none gap-[5px] mt-5">
        {hashtags.data.map((htag) => (
          <li key={htag.user_htag_id}>
            <Hashtag
              key={htag.user_htag_id}
              name={htag.htag_name}
              size="big"
              cancelHashtag={() => handleDelete(htag.user_htag_id)}
            />
          </li>
        ))}
      </div>
    </form>
  );
};

export default ModalEditTag;
