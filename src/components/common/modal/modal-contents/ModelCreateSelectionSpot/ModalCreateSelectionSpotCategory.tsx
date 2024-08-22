import SingleDropdown from "@/components/common/SingleDropdown";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";


const ModalCreateSelectionSpotCategory = (
  {spotCategories} : {spotCategories: Array<{id: number, name: string}>}
) => {
  const { category, setCategory } = useStore(useSelectionSpotCreateStore);

  const handleClick = (id: number | string, name: string) => {
    if (typeof id === 'string') {
      return setCategory(undefined);
    }
    setCategory({ 
      id, 
      name 
    });
  };

  return (
    <div className='mt-8 mb-4 flex'>
      <p className='w-1/4 text-medium font-bold'>스팟 카테고리</p>
      <SingleDropdown
        title='스팟 카테고리'
        contents={spotCategories}
        onClick={handleClick}
        initialValue={category?.name}
      />
    </div>
  )
};

export default ModalCreateSelectionSpotCategory;