import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";
import useModalExtraData from "./useModalExtraData";
import { IModalCreateSelectionSpotExtraData, ISelectionSpot } from "@/models/selection.model";
import { useSelectionCreateStore, useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";


const useSaveSelectionSpot = () => {
  const { closeModal } = useStore(useModalStore);

  const { 
    extraData: data,
    setExtraData
  } = useModalExtraData<IModalCreateSelectionSpotExtraData>();

  const { 
    addSpot, 
    updateSpot,
    spots: currentSpots 
  } = useStore(useSelectionCreateStore);

  const {
    placeName,
    category,
    description,
    selectedLocation,
    hashtags,
    spotImage,
    spotImage1,
    spotImage2,
    spotImage3,
    reset
  } = useStore(useSelectionSpotCreateStore);

  const validateAddSelectionSpot = () => {
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

    // 수정 모드일 때 아닐 떄는 index가 없음
    if (typeof data?.index != 'number' && isDuplicated) {
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

    const images = [spotImage, spotImage1, spotImage2, spotImage3].filter(
      (image) => image !== null
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
      images
    };

    // 인덱스가 있으면 수정, 없으면 추가
    if (typeof data?.index == 'number') {
      updateSpot(data.index, spot);
    } else {
      addSpot(spot);
    }

    setExtraData(null); 
    closeModal();
    reset();
  };

  return validateAddSelectionSpot;
};

export default useSaveSelectionSpot;