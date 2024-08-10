import React from "react";
import OneLineInput from "../common/input/OneLineInput";
import Image from "next/image";


interface ISelectionCreateHashtagsProps {
  hashtags: string[];
  hashtagInputValue: string;
  onAddHashtagClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDeleteHashtagClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHashtagInputValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectionCreateHashtags : React.FC<ISelectionCreateHashtagsProps> = ({
  hashtags,
  hashtagInputValue,
  onAddHashtagClick,
  onDeleteHashtagClick,
  onHashtagInputValueChange
}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="hashtags" className="w-1/4 text-medium font-bold mt-3">태그 등록</label>
        <div className="flex flex-col gap-4 w-3/4 items-stretch">
          <div className='relative w-full'>
            <OneLineInput 
              placeholder="태그명을 입력해주세요" 
              id="title" 
              name="title"
              isError={false}
              width='w-full'
              value={hashtagInputValue}
              onChange={onHashtagInputValueChange}
            />
            <button 
              className='absolute top-[50%] right-[1%] transform -translate-y-1/2'
              onClick={onAddHashtagClick}
            >
              <Image 
                src="/icons/add_7C7C7C.svg" 
                width={32} 
                height={32} 
                alt="add-spot" 
              />
            </button>
          </div>
          {
            <div className="text-small">
                <p className="text-grey4">이런 태그는 어떠세요?</p>
                <div className="flex gap-2 mt-4 text-[#02588E] overflow-x-auto flex-wrap">
                <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                </div>
            </div>
          }
          <div className="text-small">
            <p className="text-grey3">해시태그는 총 8개까지 등록 가능합니다</p>
            <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
              {hashtags.map((tag, index) => (
                <div key={index} className="px-5 py-2 w-fit border border-solid border-grey3 rounded-full flex items-center gap-3">
                  {tag}
                  <button onClick={onDeleteHashtagClick}>
                    <Image
                      src={"/icons/clear_7C7C7C.svg"}
                      width={16}
                      height={16}
                      alt="clear"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-grey4 text-small w-1/3 mt-2">해시태그를 등록하면 다른 사용자가 키워드 검색을 통해 쉽게 내 셀렉션을 발견할 수 있어요!</p>
    </div>
  );
}

export default SelectionCreateHashtags;