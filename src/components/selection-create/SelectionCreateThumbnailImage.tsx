import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

const SelectionCreateThumbnailImage: React.FC = () => {
  const { selectionPhoto, setSelectionPhoto } = useStore(
    useSelectionCreateStore
  );

  const handleThumbnailImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectionPhoto(file);
    } else {
      toast.error("png, jpg, jpeg 파일만 업로드 가능합니다.");
    }
  };

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="title" className="w-1/4 text-medium font-bold">
          셀렉션 썸네일 등록
        </label>
        <button className="relative border border-solid border-grey2 w-3/4 h-[190px] rounded-[8px] bg-white flex flex-col items-center justify-center overflow-hidden">
          {selectionPhoto ? (
            <img
              src={
                selectionPhoto instanceof File
                  ? URL.createObjectURL(selectionPhoto)
                  : selectionPhoto
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
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleThumbnailImageChange}
            className="absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0"
          />
        </button>
      </div>
      <p className="text-grey4 text-small w-1/3">
        셀렉션에서 사용자에게 표시될 썸네일입니다. 셀렉션과 가장 어울리는
        이미지를 찾아보세요
      </p>
    </div>
  );
};

export default SelectionCreateThumbnailImage;
