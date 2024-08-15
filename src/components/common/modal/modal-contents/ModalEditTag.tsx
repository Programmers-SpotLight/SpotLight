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

  if (isLoading) return <div>Loading...</div>;
  if (!hashtags || !hashtags.data) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Todo : 스낵 메세지로 변경
    e.preventDefault();
    if (tagValue.trim()) {
      if (tagValue.length === 0) {
        return;
      }
      if (tagValue.length > 10) {
        alert("10글자 이내로 작성해주세요");
        return;
      }
      if (hashtags?.data.length > 8) {
        alert("해시태그는 최대 8개까지 등록이 가능합니다");
        return;
      }
      const addTag = tagValue.replace(/\s+/g, "");
      AddHtag(addTag);
      setTagValue("");
    }
  };

  const handleDelete = (userHtagId: number | undefined) => {
    if (userHtagId) deleteHtag(userHtagId);
  };

  return (
    <form className="flex flex-col gap-[10px] h-[350px] relative" onSubmit={handleSubmit}>
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
      <div className="flex-wrap flex list-none gap-[5px] mt-2">
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
