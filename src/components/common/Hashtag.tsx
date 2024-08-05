"use client";

import React from 'react';
import { MdCancel } from "react-icons/md";


interface IHashtagProps {
  size: 'small' | 'big'
  selectionId?: number,
  spotId?: string,
  htagId?: string,
  name: string;
  status?: string,
  cancelHashtag?: (e: React.MouseEvent) => void; // 함수가 존재할 때 삭제 버튼 노출
}

const hashtagSize = {
  small: 'px-2 py-1 max-w-[54px] text-[10px]',
  big: 'px-3 py-1 max-w-[160px] text-sm'
}

const hashtagCommonClass = ' text-center text-gray-500 rounded-full border-solid border border-grey2 mr-2 flex gap-[5px] items-center bg-white'

const Hashtag: React.FC<IHashtagProps> = ({ 
  size,
  selectionId,
  spotId,
  htagId,
  name,
  status,
  cancelHashtag,
}) => {
  const handleCancelHashtag = (e: React.MouseEvent) => {
    e.preventDefault();
    if(cancelHashtag) cancelHashtag(e);
  }

  return (
    <div
      className={hashtagSize[size] + hashtagCommonClass}
    >
      <div className='truncate'>{name}</div>
      { !!cancelHashtag ? 
        (
          <div onClick={handleCancelHashtag}><MdCancel/></div>
        ) : null
      }
    </div>
  );
};

export default Hashtag;
