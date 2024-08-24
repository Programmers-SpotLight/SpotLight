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
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
      
      if (!validFileTypes.includes(selectedFile.type)) {
        toast.error("유효하지 않은 파일 형식입니다. JPEG, PNG 또는 GIF 파일을 선택해주세요.");
        setFile(null);
        return;
      }

      setFile(selectedFile);

      try {
        await updateProfilePicture(userId, selectedFile);
        toast.success("프로필 이미지가 성공적으로 업데이트되었습니다.");
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
            fileInputRef.current.click(); // 파일 선택 창 열기
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

const updateProfilePicture = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const response = await fetch(`/api/users/${userId}/profile`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("업데이트 실패");
  }
};

export default UserProfileImage;
