import Image from "next/image";
import { toast } from "react-toastify";

interface ModalCreateSelectionSpotImagesInputProps {
  spotPhoto: File | string | null;
  setSpotPhoto: (photo: File | string) => void;
}

const ModalCreateSelectionSpotImagesInput = ({
  spotPhoto,
  setSpotPhoto
}: ModalCreateSelectionSpotImagesInputProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSpotPhoto(file);
    } else {
      toast.error("png, jpg, jpeg 파일만 업로드 가능합니다.");
    }
  };

  return (
    <button className="relative border border-solid border-grey2 w-3/4 h-[155px] rounded-[8px] bg-white flex flex-col items-center justify-center">
      {spotPhoto ? (
        <img
          src={
            typeof spotPhoto === "string"
              ? spotPhoto
              : URL.createObjectURL(spotPhoto)
          }
          className="w-auto h-full object-cover"
          alt="thumbnail"
        />
      ) : (
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
