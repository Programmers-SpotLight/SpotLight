import useModalExtraData from "@/hooks/useModalExtraData";
import { IModalCreateSelectionSpotExtraData, ISelectionSpot } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useSelectionCreateStore, useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
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
  const { deleteSpot } = useStore(useSelectionCreateStore);
  const { 
    openModal,
  } = useStore(useModalStore);
  const { setExtraData } = useModalExtraData<IModalCreateSelectionSpotExtraData>();

  const {
    setPlaceName,
    setAddress,
    setCurrentCoordinate,
    setTitle,
    setDescription,
    setCategory,
    setSelectedLocation,
    setSpotDescription,
    setSpotPhoto,
    setSpotPhoto1,
    setSpotPhoto2,
    setSpotPhoto3,
    addHashtag,
  } = useStore(useSelectionSpotCreateStore);

  const handleDeleteSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteSpot(index);
  };

  const handleEditSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExtraData({
      spotCategories: spotCategories,
      index,
    });
    setPlaceName(spot.title);
    setAddress(spot.formattedAddress);
    setCurrentCoordinate({
      lat: spot.latitude,
      lng: spot.longitude,
    });
    setTitle(spot.title);
    setDescription(spot.description);
    setCategory({
      id: spot.category,
      name: spotCategories.find(
        (category) => category.id === spot.category
      )?.name || "",
    });
    setSelectedLocation({
      key: 'User\'s current location',
      placeId: spot.placeId,
      address: spot.formattedAddress,
      location: {
        lat: spot.latitude,
        lng: spot.longitude,
      },
    });
    setSpotDescription(spot.description);

    if (spot.photos.length > 0) {
      setSpotPhoto(spot.photos[0]);
    }
    if (spot.photos.length > 1) {
      setSpotPhoto1(spot.photos[1]);
    }
    if (spot.photos.length > 2) {
      setSpotPhoto2(spot.photos[2]);
    }
    if (spot.photos.length > 3) {
      setSpotPhoto3(spot.photos[3]);
    }
    
    spot.hashtags.forEach((hashtag) => {
      addHashtag(hashtag as string);
    });
    
    openModal('GoogleMapsAddSelectionSpot');
  }

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