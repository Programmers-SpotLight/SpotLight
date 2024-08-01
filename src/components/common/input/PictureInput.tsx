import React, { useState } from 'react';
import { FaCamera } from "react-icons/fa";

interface IPictureInputProps {
  inputSize: "small" | "large";
}

const PictureInput = ({ inputSize }: IPictureInputProps) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const sizeStyles = {
    small: "w-[155px] h-[123px]",
    large: "w-[328px] h-[187px]"
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${sizeStyles[inputSize]} relative border border-solid border-grey2 text-grey4 text-Large rounded-lg flex flex-col items-center justify-center`}>
      {/* <FaCamera /> */}
      {image ? (
        <img src={image as string} alt="Uploaded" className="w-full h-full object-fill rounded-lg" />
      ) : (
        <>
          <FaCamera />
        </>
      )}
      <input
        type="file"
        // accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default PictureInput;