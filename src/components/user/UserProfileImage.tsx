import useUpdateUserProfileImage from "@/hooks/mutations/useUpdateUserProfileImage";
import Image from "next/image";
import React, { useRef } from "react";
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
  const { userProfileUpdate } = useUpdateUserProfileImage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const validFileTypes = ["image/jpeg", "image/png", "image/svg+xml"];
      
      if (!validFileTypes.includes(selectedFile.type)) {
        toast.error("유효하지 않은 파일 형식입니다. JPEG, PNG 또는 SVG 파일을 선택해주세요.");
        return;
      }
      
      try {
        await userProfileUpdate({ userId, imgFile: selectedFile });
      } catch (error) {
        toast.error("프로필 이미지를 업데이트하는 데 실패했습니다. 다시 시도해 주세요.");
      }
    }
    event.target.value = '';
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
            alt={nickname}
            fill
            className="rounded-full object-cover"
            priority 
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
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
        accept="image/jpeg, image/png, image/svg"
      />
    </div>
  );
};

export default UserProfileImage;
