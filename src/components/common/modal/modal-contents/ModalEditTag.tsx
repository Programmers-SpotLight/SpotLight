"use client";

import React, { useState } from "react";
import TextInput from "../../input/TextInput";
import { FaSearch } from "react-icons/fa";
import Hashtag from "../../Hashtag";
import useSearchAutoComplete from "@/hooks/useSearchAutoComplete";
import { useFetchUserHashtag } from "@/hooks/queries/useFetchUserInfo";
import AutoCompletion from "@/components/search/search-contents/AutoCompletion";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import { useAddUserHashtag, useDeleteHashtag } from "@/hooks/mutations/useUpdateUserHashtag";

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
    setVisibleAutoCompletion,
    searchValidator
  } = useSearchAutoComplete();
  const { AddHtag } = useAddUserHashtag(userId);
  const { deleteHtag } = useDeleteHashtag(userId);
  const { data: hashtags, isLoading } = useFetchUserHashtag(userId);

  if (isLoading) return <SearchLoading height="medium" />;
  if (!hashtags || !hashtags.data) return null;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addTag = tagValue.replace(/\s+/g, "");
      if(searchValidator(addTag, hashtags.data)) {
      AddHtag(tagValue)
      setTagValue('');
    } else {
      setVisibleAutoCompletion(false)
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
      <h1 className="text-small text-grey3 mt-5">
        해시태그는 10글자 이내로 작성해주세요
      </h1>
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
