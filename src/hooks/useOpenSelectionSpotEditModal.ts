import {
  IModalCreateSelectionSpotExtraData,
  ISelectionSpot
} from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";
import useModalExtraData from "./useModalExtraData";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { toast } from "react-toastify";

const useOpenSelectionSpotEditModal = () => {
  const { openModal } = useStore(useModalStore);
  const { setExtraData } =
    useModalExtraData<IModalCreateSelectionSpotExtraData>();

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
    addHashtag
  } = useStore(useSelectionSpotCreateStore);

  const openSpotEditModal = (
    spotCategories: { id: number; name: string }[],
    spot: ISelectionSpot,
    index: number
  ) => {
    if (spotCategories.length === 0) {
      toast.error("스팟 카테고리가 없습니다. 다시 시도해주세요.");
      return;
    }

    setExtraData({
      spotCategories: spotCategories,
      index
    });
    setPlaceName(spot.title);
    setAddress(spot.formattedAddress);
    setCurrentCoordinate({
      lat: spot.latitude,
      lng: spot.longitude
    });
    setTitle(spot.title);
    setDescription(spot.description);
    setCategory({
      id: spot.category,
      name:
        spotCategories.find((category) => category.id === spot.category)
          ?.name || ""
    });
    setSelectedLocation({
      key: "User's current location",
      placeId: spot.placeId,
      address: spot.formattedAddress,
      location: {
        lat: spot.latitude,
        lng: spot.longitude
      }
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

    openModal("GoogleMapsAddSelectionSpot");
  };

  return openSpotEditModal;
};

export default useOpenSelectionSpotEditModal;
