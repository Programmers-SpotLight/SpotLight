import Image from "next/image";
import { toast } from "react-toastify";

interface ModalCreateSelectionSpotImagesInputProps {
  spotImage: File | string | null;
  setSpotImage: (photo: File | string) => void;
}

const ModalCreateSelectionSpotImagesInput = ({
  spotImage,
  setSpotImage
} : ModalCreateSelectionSpotImagesInputProps) => {

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSpotImage(file);
    } else {
      toast.error("png, jpg, jpeg 파일만 업로드 가능합니다.");
    }
  };

  return (
    <button className="relative border border-solid border-grey2 w-3/4 h-[155px] rounded-[8px] bg-white flex flex-col items-center justify-center">
      {/* 이미지가 string이면 이미지를 보여주고, File이면 URL.createObjectURL로 보여준다. */}
      {typeof spotImage === 'string' && (
        <Image 
          src={`/images/selections/spots/${spotImage}`} 
          className="w-auto h-full object-cover" 
          alt="thumbnail"
        />
      )}
      {/* 이미지가 File이면 URL.createObjectURL로 보여준다. */}
      {spotImage instanceof File && (
        <img 
          src={
            URL.createObjectURL(spotImage)
          }
          className="w-auto h-full object-cover"
          alt="thumbnail"
        />
      )}
      {/* 이미지가 없으면 카메라 아이콘을 보여준다. */}
      {!spotImage && (
        <Image
          src="/icons/photo_camera_7C7C7C.svg"
          width={32}
          height={32}
          alt="upload_photo"
        />
      )}
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={handleImageChange}
        className="absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0"
      />
    </button>
  );
};

export default ModalCreateSelectionSpotImagesInput;
