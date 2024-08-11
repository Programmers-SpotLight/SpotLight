import useOpenSelectionSpotEditModal from "@/hooks/useOpenSelectionSpotEditModal";
import { ISelectionSpot } from "@/models/selection.model";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import Image from "next/image";
import { useStore } from "zustand";


interface ISelectionCreateSpotItemProps {
  spotCategories: { id: number; name: string }[];
  spot: ISelectionSpot;
  index: number;
}

const SelectionCreateSpotItem : React.FC<ISelectionCreateSpotItemProps> = ({ 
  spot, 
  index, 
  spotCategories
}) => {
  const openSpotEditModal = useOpenSelectionSpotEditModal();
  const { deleteSpot } = useStore(useSelectionCreateStore);

  const handleDeleteSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteSpot(index);
  };

  const handleEditSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openSpotEditModal(
      spotCategories, 
      spot, 
      index
    );
  };

  return (
    <div key={index} className="flex items-center justify-between w-full">
      <div className="flex gap-4 items-center text-medium">
        <Image 
          src="/icons/move_7C7C7C.svg" 
          width={1} 
          height={1} 
          alt="upload_photo"
          className="w-[16px] h-[16px]"
        />
        <div className="flex items-center gap-2">
          <Image
            src={"/icons/location_on_7C7C7C.svg"}
            width={16}
            height={16}
            alt="location"
          />
          {spot.title}
        </div>
        <button
          onClick={handleEditSpotClick}
        >
          <Image
            src={"/icons/edit_7C7C7C.svg"}
            width={16}
            height={16}
            alt="edit"
          />
        </button>
        <button 
          onClick={handleDeleteSpotClick}
        >
          <Image
            src={"/icons/clear_7C7C7C.svg"}
            width={16}
            height={16}
            alt="clear"
          />
        </button>
      </div>
    </div>
  )
};

export default SelectionCreateSpotItem;