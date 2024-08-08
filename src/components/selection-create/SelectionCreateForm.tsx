'use client';

import Image from "next/image";
import OneLineInput from "../common/input/OneLineInput";
import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";
import SelectionCreateTitle from "./SelectionCreateTitle";
import SelectionCreateDescription from "./SelectionCreateDescription";
import { ISelectionCategory } from "@/models/selection.model";
import useSelectionCategories from "@/hooks/useSelectionCategories";
import useSelectionLocations from "@/hooks/useSelectionLocations";
import SelectionCreateCategory from "./SelectionCreateCategory";
import SelectionCreateLocation from "./SelectionCreateLocation";
import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";
import { useSelectionCreateSpotCategoryStore, useSelectionCreateStore } from "@/stores/selectionCreateStore";
import axios from "axios";
import useSpotCategories from "@/hooks/useSpotCategories";


const SelectionCreateForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<undefined | {id: number, name: string}>(undefined);
  const [location, setLocation] = useState<{
    location: undefined | {id: number, name: string},
    subLocation: undefined | {id: number, name: string}
  }>({location: undefined, subLocation: undefined});
  const [thumbnailImage, setThumbnailImage] = useState<File | string | null>(null);
  const [hashtagInputValue, setHashtagInputValue] = useState<string>("");
  const [hashtags, setHashtags] = useState<Array<string>>([]);

  const { openModal, setExtraData } = useStore(useModalStore);
  const { spots, deleteSpot, updateSpot } = useStore(useSelectionCreateStore);
  const { setSpotCategories } = useStore(useSelectionCreateSpotCategoryStore);

  const handleAddSpotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal('GoogleMapsAddSelectionSpot');
  };
  
  const {
    spotCategories, 
    isLoading: isSpotCategoriesLoading, 
    error: spotCategoriesError
  } = useSpotCategories();

  const { 
    selectedCategories, 
    isLoading: isCategoriesLoading, 
    error: categoriesError, 
  } = useSelectionCategories();

  const { 
    selectionLocations, 
    isLoading: isLocationsLoading, 
    error: locationsError, 
  } = useSelectionLocations();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (categoryValue: string) => {
    setCategory({
      id: parseInt(categoryValue),
      name: selectedCategories.find((cat) => cat.id === parseInt(categoryValue))?.name || ""
    });
  }

  const handleLocationChange = (locationValue: string) => {
    setLocation({
      location: {
        id: parseInt(locationValue), 
        name: selectionLocations.find((loc) => loc.id === parseInt(locationValue))?.name || ""
      },
      subLocation: {
        id: 0,
        name: "선택하세요"
      }
    });
  };

  const handleSubLocationChange = (subLocationValue: string) => {
    setLocation({
      ...location,
      subLocation: {
        id: parseInt(subLocationValue),
        name: selectionLocations.find((loc) => loc.id === location.location?.id)?.options.find(
          (subLoc) => subLoc.id === parseInt(subLocationValue))?.name || ""
      }
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setThumbnailImage(file);
    } else {
      alert('png, jpg, jpeg 파일만 업로드 가능합니다.');
    }
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

    const spotsPhotos: Array<{placeId: string, photos: Array<File | string>}> = [];
    if (spots.length > 0) {
      for (let i = 0; i < spots.length; i++) {
        const images = spots[i].photos;
        for (let j = 0; j < images.length; j++) {
          formData.append(`spots[${spots[i].placeId}][photos][${j}]`, images[j]);
        }
        spotsPhotos.push({placeId: spots[i].placeId, photos: images});
        const clone = {...spots[i], photos: []};
        updateSpot(i, clone);
      }
      formData.append('spots', JSON.stringify(spots));
    }

    if (hashtags.length > 0) {
      formData.append('hashtags', JSON.stringify(hashtags));
    }

    axios.post('/api/selections', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      alert('셀렉션 미리저장이 성공적으로 되었습니다.');
    }).catch((err) => {
      alert('미리저장에 실패했습니다.');
      for (let i = 0; i < spots.length; i++) {
        const clone = {...spots[i], photos: spotsPhotos[i].photos};
        updateSpot(i, clone);
        console.log(spots[i]);
      }
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

    const spotsPhotos: Array<{placeId: string, photos: Array<File | string>}> = [];
    if (spots.length > 0) {
      // 스팟 이미지를 formData에 추가
      // JSON.stringify에 이미지 파일을 추가하면 에러가 발생하기 때문에
      for (let i = 0; i < spots.length; i++) {
        const images = spots[i].photos;
        for (let j = 0; j < images.length; j++) {
          formData.append(`spots[${spots[i].placeId}][photos][${j}]`, images[j]);
        }
        spotsPhotos.push({placeId: spots[i].placeId, photos: images});
        const clone = {...spots[i], photos: []};
        updateSpot(i, clone);
      }
      formData.append('spots', JSON.stringify(spots));
    }

    if (hashtags.length === 0) {
      alert('태그를 등록해주세요.');
      return;
    }
    formData.append('hashtags', JSON.stringify(hashtags));

    axios.post('/api/selections', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      alert('셀렉션이 성공적으로 등록되었습니다.');
    }).catch((err) => {
      alert('제출에 실패했습니다.');
      for (let i = 0; i < spots.length; i++) {
        const clone = {...spots[i], photos: spotsPhotos[i].photos};
        updateSpot(i, clone);
        console.log(spots[i]);
      }
    })
  }

  useEffect(() => {
    if (spotCategories.length > 0) {
      setSpotCategories(spotCategories);
    }
  }, [spotCategories]);

  return (
    <div>
      <div className="mt-8 w-[90%] z-10">
        <form className="divide-y-[1px] divide-solid divide-grey2">
          <SelectionCreateTitle 
            title={title} 
            onChange={handleTitleChange} 
          />
          <SelectionCreateDescription 
            description={description} 
            onChange={handleDescriptionChange} 
          />
          {(selectedCategories.length > 0 && !isCategoriesLoading && !categoriesError) && (
          <SelectionCreateCategory>
            <DropdownMenu 
              onChange={handleCategoryChange}
              options={
                selectedCategories.map((category: ISelectionCategory) => ({
                  value: category.id,
                  label: category.name
                }))
              }
              currentChoice={category?.name}
            />
          </SelectionCreateCategory>
          )}
          {(selectionLocations.length > 0 && !isLocationsLoading && !locationsError) && (
            <SelectionCreateLocation>
              <div className="flex w-3/4 gap-[100px]">
                <DropdownMenu 
                  onChange={handleLocationChange}
                  options={
                    selectionLocations.map((location) => ({
                      value: location.id,
                      label: location.name
                    }))
                  }
                />
                <DropdownMenu 
                  onChange={handleSubLocationChange}
                  options={
                    selectionLocations.find((loc) => loc.id === location.location?.id)?.options.map((subLocation) => ({
                      value: subLocation.id,
                      label: subLocation.name
                    }))
                  }
                  currentChoice={location.subLocation?.name}
                />
              </div>
            </SelectionCreateLocation>
          )}
          <div className="flex items-start gap-6 py-6">
            <div className="flex items-start grow">
              <label htmlFor="title" className="w-1/4 text-medium font-bold">셀렉션 썸네일 등록</label>
              <button className="relative border border-solid border-grey2 w-3/4 h-[190px] rounded-[8px] bg-white flex flex-col items-center justify-center overflow-hidden">
                {thumbnailImage ? (
                  <img 
                    src={
                      thumbnailImage instanceof File ? 
                        URL.createObjectURL(thumbnailImage) : 
                        thumbnailImage
                    } 
                    className="w-auto h-full object-cover absolute"
                    alt="thumbnail"
                  />
                ) : (
                  <Image 
                    src="/icons/photo_camera_7C7C7C.svg" 
                    width={56} 
                    height={56} 
                    alt="upload_photo"
                  />
                )}
                <input
                  type='file'
                  accept='.png, .jpg, .jpeg'
                  onChange={handleImageChange}
                  className='absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0'
                />
              </button>
            </div>
            <p className="text-grey4 text-small w-1/3">셀렉션에서 사용자에게 표시될 썸네일입니다. 셀렉션과 가장 어울리는 이미지를 찾아보세요</p>
          </div>
          <div className="flex items-start gap-6 py-6">
            <div className="flex items-start grow">
              <label htmlFor="spots" className="w-1/4 text-medium font-bold">스팟 등록</label>
              <div className="w-3/4 relative">
                <button 
                  className="w-[50px] h-[50px] top-[50%] right-[-35px] absolute p-5 translate-y-[-50%] rounded-full border border-solid border-grey2 bg-white"
                  onClick={handleAddSpotClick}
                >
                  <Image 
                    src="/icons/add_7C7C7C.svg" 
                    width={48} 
                    height={48} 
                    alt="add_spot"
                    className="absolute w-1/2 h-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </button>
                <div className="border border-solid border-grey2 w-full h-[190px] rounded-[8px] bg-white flex flex-col items-start gap-6 p-4 overflow-y-auto">
                  {/* 스팟 리스트 */}
                  {spots.map((spot, index) => (
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
                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          handleSpotDeleteClick(index)
                        }}>
                          <Image
                            src={"/icons/clear_7C7C7C.svg"}
                            width={16}
                            height={16}
                            alt="clear"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between h-[190px] w-1/3">
              <p className="text-grey4 text-small w-full">사용자에게 제공되는 스팟입니다. 나만 알기 아까운 명소들을 없이 마음 껏 공유하세요!</p>
              <p className="text-grey4 text-small w-full">사용자에게 제공되는 스팟입니다. 나만 알기 아까운 명소들을 없이 마음 껏 공유하세요!</p>
            </div>
          </div>
          <div className="flex items-start gap-6 py-6">
            <div className="flex items-start grow">
              <label htmlFor="hashtags" className="w-1/4 text-medium font-bold mt-3">태그 등록</label>
              <div className="flex flex-col gap-4 w-3/4 items-stretch">
                <div className='relative w-full'>
                  <OneLineInput 
                    placeholder="태그명을 입력해주세요" 
                    id="title" 
                    name="title"
                    isError={false}
                    width='w-full'
                    value={hashtagInputValue}
                    onChange={handleHashtagInputValueChange}
                  />
                  <button 
                    className='absolute top-[50%] right-[1%] transform -translate-y-1/2'
                    onClick={handleAddHashtagClick}
                  >
                    <Image 
                      src="/icons/add_7C7C7C.svg" 
                      width={32} 
                      height={32} 
                      alt="add-spot" 
                    />
                  </button>
                </div>
                {
                /*
                <div className="text-small">
                  <p className="text-grey4">이런 태그는 어떠세요?</p>
                  <div className="flex gap-2 mt-4 text-[#02588E] overflow-x-auto flex-wrap">
                    <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                    <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                    <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                    <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                    <p className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full">해시태그</p>
                  </div>
                </div>
                */
                }
                <div className="text-small">
                  <p className="text-grey4">해시태그는 총 8개까지 등록 가능합니다</p>
                  <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
                    {hashtags.map((tag, index) => (
                      <div key={index} className="px-5 py-2 w-fit border border-solid border-grey3 rounded-full flex items-center gap-3">
                        {tag}
                        <button onClick={handleDeleteHashtagClick}>
                          <Image
                            src={"/icons/clear_7C7C7C.svg"}
                            width={16}
                            height={16}
                            alt="clear"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-grey4 text-small w-1/3 mt-2">해시태그를 등록하면 다른 사용자가 키워드 검색을 통해 쉽게 내 셀렉션을 발견할 수 있어요!</p>
          </div>
        </form>
      </div>
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
    </div>
  );
};

export default SelectionCreateForm;