'use client';

import { useEffect, useState } from "react";
import SelectionCreateTitle from "./SelectionCreateTitle";
import SelectionCreateDescription from "./SelectionCreateDescription";
import useSelectionCategories from "@/hooks/useSelectionCategories";
import useSelectionLocations from "@/hooks/useSelectionLocations";
import SelectionCreateCategory from "./SelectionCreateCategory";
import SelectionCreateLocation from "./SelectionCreateLocation";
import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";
import { 
  useSelectionCreateStore 
} from "@/stores/selectionCreateStore";
import useSpotCategories from "@/hooks/useSpotCategories";
import SelectionCreateThumbnailImage from "./SelectionCreateThumbnailImage";
import SelectionCreateSpot from "./SelectionCreateSpot";
import SelectionCreateHashtags from "./SelectionCreateHashtags";
import SelectionCreateSubmit from "./SelectionCreateSubmit";
import SelectionCreateFormLoadingSpinner from "./SelectionCreateFormLoadingSpinner";
import { submitSelection } from "@/http/selectionCreate.api";
import { ISelectionCategory, ISelectionSpot } from "@/models/selection.model";


const SelectionCreateForm = () => {
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<ISelectionCategory | undefined>(undefined);
  const [location, setLocation] = useState<{
    location: undefined | {id: number, name: string},
    subLocation: undefined | {id: number, name: string}
  }>({location: undefined, subLocation: undefined});
  const [thumbnailImage, setThumbnailImage] = useState<File | string | null>(null);
  const [hashtagInputValue, setHashtagInputValue] = useState<string>("");
  const [hashtags, setHashtags] = useState<Array<string>>([]);

  const { openModal, setExtraData } = useStore(useModalStore);
  const { spots, deleteSpot, updateSpot } = useStore(useSelectionCreateStore);

  console.log(category)
  console.log(location)

  const {
    spotCategories, 
    error: spotCategoriesError
  } = useSpotCategories();

  const { 
    selectedCategories, 
    error: categoriesError, 
  } = useSelectionCategories();

  const { 
    selectionLocations, 
    error: locationsError, 
  } = useSelectionLocations();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setThumbnailImage(file);
    } else {
      alert('png, jpg, jpeg 파일만 업로드 가능합니다.');
    }
  };

  const handleAddSpotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setExtraData({
      spotCategories
    });
    openModal('GoogleMapsAddSelectionSpot');
  };

  const handleSpotDeleteClick = (index: number) => {
    deleteSpot(index);
  }

  const handleHashtagInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInputValue(e.target.value);
  };

  const handleAddHashtagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hashtags.length >= 8) {
      alert('태그는 최대 8개까지 등록 가능합니다.');
      return;
    }
    if (hashtagInputValue === "") {
      alert('태그명을 입력해주세요.');
      return;
    }
    if (hashtags.includes(hashtagInputValue)) {
      alert('이미 등록된 태그입니다.');
      return;
    }

    setHashtags([...hashtags, hashtagInputValue]);
    setHashtagInputValue("");
  }

  const handleDeleteHashtagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tag = e.currentTarget.parentElement?.textContent;
    if (tag) {
      setHashtags(hashtags.filter((t) => t !== tag));
    }
  }

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

    if (location.location && location.subLocation) {
      formData.append('location', JSON.stringify({
        location: location.location.id,
        subLocation: location.subLocation.id
      }));
    }

    if (thumbnailImage) {
      formData.append('img', thumbnailImage);
    }

    const spotsPhotos: Array<{
      placeId: string, 
      photos: Array<File | string>
    }> = separateSpotPhotos(spots, formData);

    if (hashtags.length > 0) {
      formData.append('hashtags', JSON.stringify(hashtags));
    }

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
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    formData.append('title', title);
    formData.append('status', 'public');

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

    if (!location.location || !location.subLocation) {
      alert('지역을 선택해주세요.');
      return;
    }
    formData.append('location', JSON.stringify({
      location: location.location.id,
      subLocation: location.subLocation
    }));

    if (thumbnailImage) {
      formData.append('img', thumbnailImage);
    }

    if (spots.length === 0) {
      alert('스팟을 등록해주세요.');
      return;
    }

    const spotsPhotos: Array<{
      placeId: string, 
      photos: Array<File | string>
    }> = separateSpotPhotos(spots, formData);

    if (hashtags.length === 0) {
      alert('태그를 등록해주세요.');
      restoreSpotPhotos(spots, spotsPhotos);
      return;
    }
    formData.append('hashtags', JSON.stringify(hashtags));

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
  const separateSpotPhotos = (spots: ISelectionSpot[], formData: FormData) => {
    const spotsPhotos: Array<{placeId: string, photos: Array<File | string>}> = [];
    if (spots.length > 0) {
      for (let i = 0; i < spots.length; i++) {
        const images = spots[i].photos;
        for (let j = 0; j < images.length; j++) {
          console.log("Found image:", images[j]);
          formData.append(`spots[${spots[i].placeId}][photos][${j}]`, images[j]);
        }
        spotsPhotos.push({placeId: spots[i].placeId, photos: images});
        const clone = {...spots[i], photos: []};
        updateSpot(i, clone);
      }
      formData.append('spots', JSON.stringify(spots));
    }
    console.log(spotsPhotos);
    return spotsPhotos;
  }

  // 서브미션 실패시 FormData로 분리한 사진을 다시 spots 배열에 복원하는 함수
  const restoreSpotPhotos = (
    spots: ISelectionSpot[], 
    spotsPhotos: Array<{placeId: string, photos: Array<File | string>}>
  ) => {
    console.log(spotsPhotos);
    for (let i = 0; i < spots.length; i++) {
      const clone = {...spots[i], photos: spotsPhotos[i].photos};
      updateSpot(i, clone);
    }
  }

  // 기존에 선택된 카테고리, 지역, 스팟 카테고리가 모두 로드되면 페이지를 렌더링.
  // 하나라도 불러오기 실패하면 에러 메시지를 렌더링.
  useEffect(() => {
    if (
      (selectedCategories.length > 0 && selectionLocations.length > 0 && spotCategories.length > 0) ||
      (categoriesError || locationsError || spotCategoriesError)
    ) {
      setIsPageLoaded(true);
    }
  }, [
    selectedCategories, 
    selectionLocations, 
    spotCategories,
    categoriesError,
    locationsError,
    spotCategoriesError
  ]);

  if (!isPageLoaded) {
    return (
      <div className="flex flex-col justify-center items-center grow">
        <SelectionCreateFormLoadingSpinner />
      </div>
    )
  }

  if (categoriesError || locationsError || spotCategoriesError) {
    return (
      <div className="flex flex-col justify-center items-center grow gap-[30px]">
        <h1 className="text-extraLarge font-bold">페이지를 불러오는 중 에러가 발생했습니다.</h1>
        <h2 className="text-large font-bold">잠시 후 다시 시도해주세요.</h2>
      </div>
    )
  }

  return (
    <div className="grow">
      <div className="mt-8 max-w-[1086px] z-10">
        <form className="divide-y-[1px] divide-solid divide-grey2">
          <SelectionCreateTitle 
            title={title} 
            onChange={handleTitleChange} 
          />
          <SelectionCreateDescription 
            description={description} 
            onChange={handleDescriptionChange} 
          />
          <SelectionCreateCategory 
          setCategory={setCategory}/>
          <SelectionCreateLocation
          setLocation={setLocation}
          />
          <SelectionCreateThumbnailImage
            thumbnailImage={thumbnailImage}
            onThumbnailImageChange={handleImageChange}
          />
          <SelectionCreateSpot 
            spots={spots}
            onAddSpotClick={handleAddSpotClick}
            onDeleteSpotClick={handleSpotDeleteClick}
          />
          <SelectionCreateHashtags
            hashtagInputValue={hashtagInputValue}
            onHashtagInputValueChange={handleHashtagInputValueChange}
            onAddHashtagClick={handleAddHashtagClick}
            onDeleteHashtagClick={handleDeleteHashtagClick}
            hashtags={hashtags}
          />
        </form>
      </div>
      <SelectionCreateSubmit
        onTempSubmitClick={handleTempSubmitClick}
        onSelectionSubmitClick={handleSelectionSubmitClick}
      />
    </div>
  );
};

export default SelectionCreateForm;