import OneLineInput from "@/components/common/input/OneLineInput";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";


const ModalCreateSelectionSpotInfo = () => {
  const { 
    placeName, 
    description: spotDescription, 
    setPlaceName, 
    setDescription 
  } = useStore(useSelectionSpotCreateStore);

  const handlePlaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div>
      <p className="text-medium font-bold mt-8 mb-4">스팟 정보</p>
      <div className='mt-4'>
        <OneLineInput
          placeholder='스팟의 이름을 입력해주세요'
          width='w-full'
          value={placeName}
          onChange={handlePlaceNameChange}
        />
      </div>
      <div className='mt-4'>
        <textarea 
          className="border-solid h-[100px] border border-grey2 p-3 rounded-[8px] placeholder:font-medium w-full resize-none" 
          placeholder="스팟에 대한 상세설명을 입력해주세요." 
          id="description" 
          name="description" 
          value={spotDescription}
          onChange={handleDescriptionChange}
        />
      </div>
    </div>
  )
};

export default ModalCreateSelectionSpotInfo;