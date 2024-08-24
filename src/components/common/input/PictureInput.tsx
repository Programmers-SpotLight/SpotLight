import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

interface IPictureInputProps {
  inputSize: "small" | "large";
  imgSrc?: string;
  onPictureChange?: (image: string, index: number, type: string) => void;
  index?: number;
}

const PictureInput = ({
  inputSize,
  imgSrc,
  onPictureChange,
  index = -1
}: IPictureInputProps) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(
    imgSrc || null
  );

  useEffect(() => {
    setImage(imgSrc || null);
  }, [imgSrc]);

  const sizeStyles = {
    small: "w-[155px] h-[123px]",
    large: "w-[328px] h-[187px]"
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (onPictureChange) {
          onPictureChange(result, index, file.type);
        } else {
          setImage(result);
        }
      };
      const fileType = file.type;
      if (!fileType.includes("image")) {
        toast.error(
          `해당 파일은 이미지 파일이 아닙니다.\n이미지(JPG,JPEG,GIF,PNG)`
        );
        return;
      }
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`${sizeStyles[inputSize]} relative border border-solid border-grey2 text-grey4 text-large rounded-lg flex flex-col items-center justify-center`}
    >
      {image ? (
        <Image
          src={image as string}
          alt="Uploaded"
          fill
          className="w-full h-full object-fill rounded-lg"
        />
      ) : (
        <>
          <FaCamera />
        </>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default PictureInput;
