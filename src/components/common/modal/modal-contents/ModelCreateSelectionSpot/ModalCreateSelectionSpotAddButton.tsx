import { ISelectionSpot } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useSelectionCreateStore, useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";


const ModalCreateSelectionSpotAddButton = () => {
  const {
    closeModal,
    setExtraData,
  } = useStore(useModalStore);

  const { 
    addSpot, 
    spots: currentSpots 
  } = useStore(useSelectionCreateStore);

  const {
    placeName,
    category,
    description,
    selectedLocation,
    hashtags,
    spotPhoto,
    spotPhoto1,
    spotPhoto2,
    spotPhoto3,
    reset
  } = useStore(useSelectionSpotCreateStore);

  const handleAddSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!placeName) {
      alert('스팟 이름을 입력해주세요.');
      return;
    }

    if (!description) {
      alert('스팟 설명을 입력해주세요.');
      return;
    }

    if (!selectedLocation.placeId) {
      alert('스팟 위치를 설정해주세요.');
      return;
    }

    // 중복된 스팟인지 확인
    const isDuplicated = currentSpots.some(
      (spot) => spot.placeId === selectedLocation.placeId
    );
    if (isDuplicated) {
      alert('이미 등록된 스팟입니다.');
      return;
    }

    if (!category) {
      alert('카테고리를 설정해주세요.');
      return;
    }

    if (!selectedLocation.address) {
      alert('스팟 주소를 설정해주세요.');
      return;
    }

    if (hashtags.length === 0) {
      alert('태그를 등록해주세요.');
      return;
    }

    const photos = [spotPhoto, spotPhoto1, spotPhoto2, spotPhoto3].filter(
      (photo) => photo !== null
    );

    const spot: ISelectionSpot = {
      placeId: selectedLocation.placeId,
      title: placeName,
      category: category.id,
      description,
      formattedAddress: selectedLocation.address,
      latitude: selectedLocation.location.lat,
      longitude: selectedLocation.location.lng,
      hashtags,
      photos
    };

    addSpot(spot);
    setExtraData(null); 
    closeModal();
    reset();
  };

  return (
    <button 
      className="block mx-auto bg-primary text-white text-medium font-bold mt-8 rounded-[8px] w-[163px] h-[40px] text-center"
      onClick={handleAddSpotClick}
    >
      등록
    </button>
  );
};

export default ModalCreateSelectionSpotAddButton;