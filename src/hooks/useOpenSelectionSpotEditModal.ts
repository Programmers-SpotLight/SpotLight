import { IModalCreateSelectionSpotExtraData, ISelectionSpot } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";
import useModalExtraData from "./useModalExtraData";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";


const useOpenSelectionSpotEditModal = () => {
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
    setSpotImage,
    setSpotImage1,
    setSpotImage2,
    setSpotImage3,
    addHashtag,
  } = useStore(useSelectionSpotCreateStore);

  const openSpotEditModal = (
    spotCategories: { id: number; name: string }[],
    spot: ISelectionSpot,
    index: number
  ) => {
    if (spotCategories.length === 0) {
      alert('스팟 카테고리가 없습니다. 다시 시도해주세요.');
      return;
    }

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

    if (spot.images.length > 0) {
      setSpotImage(spot.images[0]);
    }
    if (spot.images.length > 1) {
      setSpotImage1(spot.images[1]);
    }
    if (spot.images.length > 2) {
      setSpotImage2(spot.images[2]);
    }
    if (spot.images.length > 3) {
      setSpotImage3(spot.images[3]);
    }
    
    spot.hashtags.forEach((hashtag) => {
      addHashtag(hashtag as string);
    });
    
    openModal('GoogleMapsAddSelectionSpot');
  }

  return openSpotEditModal;
};

export default useOpenSelectionSpotEditModal;