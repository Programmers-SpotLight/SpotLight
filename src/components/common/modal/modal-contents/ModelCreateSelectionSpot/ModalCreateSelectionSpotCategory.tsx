import Dropdown from "@/components/common/Dropdown";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";


const ModalCreateSelectionSpotCategory = (
  {spotCategories} : {spotCategories: Array<{id: number, name: string}>}
) => {
  const { setCategory } = useStore(useSelectionSpotCreateStore);

  return (
    <div className='mt-8 mb-4 flex'>
      <p className='w-1/4 text-medium font-bold'>스팟 카테고리</p>
      <Dropdown
        contents={spotCategories}
        setCategory={setCategory}
        title='스팟 카테고리'
      />
    </div>
  )
};

export default ModalCreateSelectionSpotCategory;