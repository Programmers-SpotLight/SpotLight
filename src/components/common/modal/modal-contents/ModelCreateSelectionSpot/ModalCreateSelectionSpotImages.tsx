import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";
import ModalCreateSelectionSpotImagesInput from "./ModalCreateSelectionSpotImagesInput";


const ModalCreateSelectionSpotImages = () => {
  const {
    spotImage,
    spotImage1,
    spotImage2,
    spotImage3,
    setSpotImage,
    setSpotImage1,
    setSpotImage2,
    setSpotImage3,
  } = useStore(useSelectionSpotCreateStore);

  return (
    <div>
      <p className='mt-8 font-bold text-medium mb-4'>이미지 등록 (선택)</p>
      <div className='flex gap-2'>
        <ModalCreateSelectionSpotImagesInput 
          spotImage={spotImage} 
          setSpotImage={setSpotImage} 
        />
        <ModalCreateSelectionSpotImagesInput 
          spotImage={spotImage1} 
          setSpotImage={setSpotImage1} 
        />
        <ModalCreateSelectionSpotImagesInput 
          spotImage={spotImage2} 
          setSpotImage={setSpotImage2} 
        />
        <ModalCreateSelectionSpotImagesInput 
          spotImage={spotImage3} 
          setSpotImage={setSpotImage3} 
        />
      </div>
    </div>
  )
};

export default ModalCreateSelectionSpotImages;