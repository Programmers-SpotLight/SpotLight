import { submitSelection } from "@/http/selectionCreate.api";
import { ISelectionSpot } from "@/models/selection.model";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import React from "react";
import { useStore } from "zustand";


type TTemporarySpotPhotoStorage = Array<Array<File | string>>;

const SelectionCreateSubmit : React.FC = () => {
  const { 
    title, 
    description, 
    category, 
    location, 
    subLocation,
    selectionPhoto, 
    hashtags, 
    spots, 
    updateSpot 
  } = useStore(useSelectionCreateStore);

  // 임시저장 버튼 클릭시 제출 로직
  const handleTempSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 제출 로직
    const formData = new FormData();
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    formData.append('status', 'temp');
    formData.append('title', title);

    if (description) {
      formData.append('description', description);
    }

    if (category) {
      formData.append('category', category.id.toString());
    }

    if (location && subLocation) {
      formData.append('location', JSON.stringify({
        location: location.id,
        subLocation: subLocation.id
      }));
    }

    if (selectionPhoto) {
      formData.append('img', selectionPhoto);
    }

    if (hashtags.length > 0) {
      formData.append('hashtags', JSON.stringify(hashtags));
    }

    const spotsPhotos: TTemporarySpotPhotoStorage = separateSpotPhotos(spots, formData);
    formData.append('spots', JSON.stringify(spots));

    submitSelection(
      formData,
    ).then((res) => {
      alert('셀렉션 미리저장이 성공적으로 되었습니다.');
    }).catch((err) => {
      alert('미리저장에 실패했습니다.');
      restoreSpotPhotos(spots, spotsPhotos);
    });
  }

  const handleSelectionSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 제출 로직
    const formData = new FormData();
    formData.append('status', 'public');

    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    formData.append('title', title);

    if (!description) {
      alert('설명을 입력해주세요.');
      return;
    }
    formData.append('description', description);

    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    formData.append('category', category.id.toString());

    if (!location || !subLocation) {
      alert('지역을 선택해주세요.');
      return;
    }
    formData.append('location', JSON.stringify({
      location: location.id,
      subLocation: subLocation.id
    }));

    if (!selectionPhoto) {
      alert('썸네일을 등록해주세요.');
      return;
    }
    formData.append('img', selectionPhoto);

    if (hashtags.length === 0) {
      alert('태그를 등록해주세요.');
      return;
    }
    formData.append('hashtags', JSON.stringify(hashtags));

    if (spots.length === 0) {
      alert('스팟을 등록해주세요.');
      return;
    }
    const spotsPhotos: TTemporarySpotPhotoStorage = separateSpotPhotos(spots, formData);
    formData.append('spots', JSON.stringify(spots));

    submitSelection(
      formData, 
    ).then((res) => {
      alert('셀렉션이 성공적으로 등록되었습니다.');
    }).catch((err) => {
      alert('제출에 실패했습니다.');
      restoreSpotPhotos(spots, spotsPhotos);
    });
  }

  // 바이너리인 사진 파일을 FormData에 추가하고, spots 배열에서 사진을 제거하는 함수
  function separateSpotPhotos(
    spots: ISelectionSpot[], 
    formData: FormData
  ) : TTemporarySpotPhotoStorage {
    const spotsPhotos: TTemporarySpotPhotoStorage = [];

    if (spots.length > 0) {
      for (let i = 0; i < spots.length; i++) {
        const images = spots[i].photos;
        for (let j = 0; j < images.length; j++) {
          formData.append(`spots[${spots[i].placeId}][photos][${j}]`, images[j]);
        }
        spotsPhotos.push(images);
        const clone = {...spots[i], photos: []};
        updateSpot(i, clone);
      }
    }

    return spotsPhotos;
  }

  // 서브미션 실패시 FormData로 분리한 사진을 다시 spots 배열에 복원하는 함수
  function restoreSpotPhotos (
    spots: ISelectionSpot[], 
    spotsPhotos: TTemporarySpotPhotoStorage
  ) : void {
    for (let i = 0; i < spots.length; i++) {
      const clone = {...spots[i], photos: spotsPhotos[i]};
      updateSpot(i, clone);
    }
  }

  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        className="w-[160px] text-center py-2 border border-solid border-grey2 bg-white text-medium font-medium hover:bg-grey1 hover:border-grey3"
        onClick={handleTempSubmitClick}
      >
        임시저장
      </button>
      <button
        className="w-[160px] text-center py-2 bg-primary text-white text-medium font-medium"
        onClick={handleSelectionSubmitClick}
      >
        제출
      </button>
    </div>
  )
};

export default SelectionCreateSubmit;