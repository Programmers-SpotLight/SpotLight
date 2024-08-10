import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";
import ModalCreateSelectionSpotImagesInput from "./ModalCreateSelectionSpotImagesInput";


const ModalCreateSelectionSpotImages = () => {
  const {
    spotPhoto,
    spotPhoto1,
    spotPhoto2,
    spotPhoto3,
    setSpotPhoto,
    setSpotPhoto1,
    setSpotPhoto2,
    setSpotPhoto3,
  } = useStore(useSelectionSpotCreateStore);

  return (
    <div>
      <p className='mt-8 font-bold text-medium mb-4'>이미지 등록 (선택)</p>
      <div className='flex gap-2'>
        <ModalCreateSelectionSpotImagesInput 
          spotPhoto={spotPhoto} 
          setSpotPhoto={setSpotPhoto} 
        />
        <ModalCreateSelectionSpotImagesInput 
          spotPhoto={spotPhoto1} 
          setSpotPhoto={setSpotPhoto1} 
        />
        <ModalCreateSelectionSpotImagesInput 
          spotPhoto={spotPhoto2} 
          setSpotPhoto={setSpotPhoto2} 
        />
        <ModalCreateSelectionSpotImagesInput 
          spotPhoto={spotPhoto3} 
          setSpotPhoto={setSpotPhoto3} 
        />
      </div>
    </div>
  )
};

export default ModalCreateSelectionSpotImages;