"use client";

import { useEffect, useState } from "react";
import SelectionCreateTitle from "./SelectionCreateTitle";
import SelectionCreateDescription from "./SelectionCreateDescription";
import useSelectionCategories from "@/hooks/useSelectionCategories";
import useSelectionLocations from "@/hooks/useSelectionLocations";
import SelectionCreateCategory from "./SelectionCreateCategory";
import SelectionCreateLocation from "./SelectionCreateLocation";
import useSpotCategories from "@/hooks/useSpotCategories";
import SelectionCreateThumbnailImage from "./SelectionCreateThumbnailImage";
import SelectionCreateSpot from "./SelectionCreateSpot";
import SelectionCreateHashtags from "./SelectionCreateHashtags";
import SelectionCreateSubmit from "./SelectionCreateSubmit";
import SelectionCreateFormLoadingSpinner from "./SelectionCreateFormLoadingSpinner";
import { useStore } from "zustand";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";


const SelectionCreateForm = () => {
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const { setSpotCategories } = useStore(useSelectionCreateStore);

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

  const isLoading = isCategoriesLoading || isLocationsLoading || isSpotCategoriesLoading;
  const isError = categoriesError || locationsError || spotCategoriesError;

  // 기존에 선택된 카테고리, 지역, 스팟 카테고리가 모두 로드되면 페이지를 렌더링.
  // 하나라도 불러오기 실패하면 에러 메시지를 렌더링.
  useEffect(() => {
    if (!isLoading) {
      setIsPageLoaded(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (spotCategories.length > 0) {
      setSpotCategories(spotCategories);
    }
  }, [spotCategories]);

  /* 로딩 중일 때 */
  if (!isPageLoaded) {
    return (
      <div className="flex flex-col justify-center items-center grow">
        <SelectionCreateFormLoadingSpinner />
      </div>
    );
  }

  /* 에러가 발생했을 때 */
  if (isError) {
    return (
      <div className="w-full h-[600px] flex flex-col justify-center items-center gap-[10px]">
        <h1 className="text-grey3 text-large font-semibold">
          셀렉션을 생성할 수 없습니다
        </h1>
        <h2 className="text-grey3 text-medium">다시 시도해주세요</h2>
      </div>
    );
  }

  return (
    <div className="grow">
      <div className="mt-8 max-w-[1086px] z-10">
        <form className="divide-y-[1px] divide-solid divide-grey2">
          <SelectionCreateTitle />
          <SelectionCreateDescription />
          <SelectionCreateCategory 
            selectionCategories={selectedCategories}
          />
          <SelectionCreateLocation
            selectionLocations={selectionLocations}
          />
          <SelectionCreateThumbnailImage />
          <SelectionCreateSpot 
            spotCategories={spotCategories}
          />
          <SelectionCreateHashtags />
        </form>
      </div>
      <SelectionCreateSubmit />
    </div>
  );
};

export default SelectionCreateForm;
