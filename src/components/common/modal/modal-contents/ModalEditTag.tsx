'use client';

import React, { useState, useCallback } from 'react';
import TextInput from '../../input/TextInput';
import { FaSearch } from 'react-icons/fa';
import Hashtag from '../../Hashtag';
import useSearchAutoComplete from '@/hooks/useSearchAutoComplete';
import { useFetchUserHashtag } from '@/hooks/queries/useFetchUserInfo';
import { useAddUserHashtag, useDeleteHashtag } from '@/hooks/queries/useUpdateUserHashtag';

interface ModalAddTagProps {
  userId: string;
}

const ModalEditTag = ({ userId }: ModalAddTagProps) => {
  const [tagValue, setTagValue] = useState<string>("");
  const { tagInputRef, tagACRef, handleKeyDown, visibleAutoCompletion, setVisibleAutoCompletion } = useSearchAutoComplete();
  const { AddHtag } = useAddUserHashtag(userId);
  const { deleteHtag } = useDeleteHashtag(userId);
  const { data: hashtags, isLoading } = useFetchUserHashtag(userId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tagValue.trim()) {
      const addTag = tagValue.replace(/\s+/g, "");
      AddHtag(addTag);
      setTagValue("");
    }
  };

  const handleDelete = useCallback((userHtagId: number | undefined) => {
    if(userHtagId) deleteHtag(userHtagId);
  }, [deleteHtag]);

  if (isLoading) return <div>Loading...</div>;
  if (!hashtags || !hashtags.data) return null;

  return (
    <form className='flex flex-col gap-[10px]' onSubmit={handleSubmit}>
      <TextInput
        className='text-grey2'
        width='full'
        icon={<FaSearch className='fill-grey3' />}
        placeholder='검색어를 입력해주세요'
        value={tagValue}
        onChange={(e) => {
          setTagValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className='flex-wrap flex list-none gap-[5px]'>
        {hashtags.data.map((htag) => (
          <li key={htag.user_htag_id}>
            <Hashtag name={htag.htag_name} size='big' cancelHashtag={() => handleDelete(htag.user_htag_id)} />
          </li>
        ))}
      </div>
    </form>
  );
};

export default ModalEditTag;
