import useUpdateUserProfileImage from "@/hooks/mutations/useUpdateUserProfileImage";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

interface UserProfileImageProps {
  image: string;
  userId: string;
  isMypage: boolean;
  nickname: string;
}

const UserProfileImage = ({
  image,
  userId,
  isMypage,
  nickname
}: UserProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {userProfileUpdate} =useUpdateUserProfileImage()
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
      
      if (!validFileTypes.includes(selectedFile.type)) {
        toast.error("유효하지 않은 파일 형식입니다. JPEG, PNG 또는 GIF 파일을 선택해주세요.");
        return;
      }
      
      try {
        userProfileUpdate({userId, imgFile : selectedFile});
      } catch (error) {
        toast.error("프로필 이미지를 업데이트하는 데 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <div>
      <div
        className={`w-[100px] h-[100px] relative rounded-full flex-shrink-0 ${
          isMypage &&
          "hover:scale-105 transition-transform transform cursor-pointer"
        }`}
        onClick={() => {
          if (isMypage && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {image ? (
          <Image
            src={image}
            fill
            alt={nickname}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-grey3" />
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/gif"
      />
    </div>
  );
};

export default UserProfileImage;
