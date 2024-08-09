import Image from 'next/image';
import React from 'react';


interface ISelectionCreateThumbnailImageProps {
  thumbnailImage: string | File | null;
  onThumbnailImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectionCreateThumbnailImage : React.FC<ISelectionCreateThumbnailImageProps> = ({
  thumbnailImage,
  onThumbnailImageChange
}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="title" className="w-1/4 text-medium font-bold">셀렉션 썸네일 등록</label>
        <button className="relative border border-solid border-grey2 w-3/4 h-[190px] rounded-[8px] bg-white flex flex-col items-center justify-center overflow-hidden">
        {thumbnailImage ? (
          <img 
            src={
              thumbnailImage instanceof File ? 
                URL.createObjectURL(thumbnailImage) : 
                thumbnailImage
            } 
            className="object-fill absolute"
            alt="thumbnail"
          />
        ) : (
          <Image 
            src="/icons/photo_camera_7C7C7C.svg" 
            width={56} 
            height={56} 
            alt="upload_photo"
          />
        )}
          <input
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={onThumbnailImageChange}
            className='absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0'
          />
        </button>
      </div>
      <p className="text-grey4 text-small w-1/3">셀렉션에서 사용자에게 표시될 썸네일입니다. 셀렉션과 가장 어울리는 이미지를 찾아보세요</p>
    </div>
  );
}

export default SelectionCreateThumbnailImage;