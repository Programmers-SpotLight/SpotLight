import OneLineInput from "@/components/common/input/OneLineInput";
import useClickOutside from "@/hooks/useClickOutside";
import useGeocoding from "@/hooks/useGeocoding";
import useSpotSearch from "@/hooks/useSpotSearch";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useStore } from "zustand";


const ModalCreateSelectionSpotSearchBar = () => {
  const firstRendered = useRef<boolean>(true);
  const spotSearchResultRef = useRef<HTMLDivElement>(null);
  const geocodingRequested = useRef<boolean>(false);
  const map = useMap();

  const { selectedLocation, setSelectedLocation, setCurrentCoordinate } =
    useStore(useSelectionSpotCreateStore);

  // 지오코딩 훅
  const {
    coordinates: geocodingCoordinates,
    address: geocodingAddress,
    fetchGeocodingData,
    loading: geocodingLoading,
    error: geocodingError
  } = useGeocoding();

  // 스팟 검색 훅
  const { 
    searchValue, 
    setSearchValue, 
    spots, 
    fetchSpots, 
    loading, 
    error 
  } = useSpotSearch();

  const [isSpotSearchResultOpen, setIsSpotSearchResultOpen] =
    useState<boolean>(false);

  useClickOutside(spotSearchResultRef, () => setIsSpotSearchResultOpen(false));

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      setIsSpotSearchResultOpen(true);
      firstRendered.current = false;
      fetchSpots();
    }
  };

  const handleSearchInputFocus = () => {
    setIsSpotSearchResultOpen(true);
  };

  const handleGeocodingClick = (placeId: string) => {
    if (!placeId) {
      return;
    }
    if (placeId === selectedLocation?.placeId) {
      return;
    }

    geocodingRequested.current = true;
    setSelectedLocation({
      ...selectedLocation,
      placeId: placeId
    });
    fetchGeocodingData(placeId);
  };

  // 지오코딩 결과 처리
  useEffect(() => {
    // 처음 렌더링 시 실행되지 않도록
    if (!geocodingRequested.current) {
      return;
    }
    if (geocodingLoading) return;
    if (geocodingError) {
      return;
    }

    setSelectedLocation({
      ...selectedLocation,
      location: geocodingCoordinates || { lat: 0, lng: 0 },
      address: geocodingAddress || ""
    });

    // 사용자가 선택한 위치로 마커 배치 후 중앙으로 설정
    setCurrentCoordinate(
      geocodingCoordinates || { lat: 37.5503, lng: 126.9971 }
    );
    map?.setCenter(geocodingCoordinates || { lat: 37.5503, lng: 126.9971 });
  }, [
    geocodingLoading,
    geocodingError,
    geocodingCoordinates,
    geocodingAddress
  ]);

  return (
    <div className="mt-4 relative">
      {selectedLocation.address && (
        <div className="mb-4">
          <p className="text-small font-bold">현재 스팟 주소</p>
          <p className="text-grey4 text-small mt-2">
            {selectedLocation.address}
          </p>
        </div>
      )}
      <OneLineInput
        placeholder="스팟을 검색해주세요"
        width="w-full"
        value={searchValue}
        onChange={handleSearchValueChange}
        onFocus={handleSearchInputFocus}
        onKeyDown={handleSearchKeyDown}
      />
      {isSpotSearchResultOpen && (
        <div
          ref={spotSearchResultRef}
          className="absolute top-[110%] p-3 border border-solid border-black w-full bg-white rounded-[8px]"
        >
          <ul className="text-grey4 w-full max-h-[192px] overflow-y-auto">
            {firstRendered.current && (
              <li className="py-2 text-center">원하시는 스팟의 이름이나 주소를 입력해주세요</li>
            )}
            {/* 검색 결과 로딩 시 */}
            {loading && <li className="py-2">로딩 중...</li>}

            {/* 검색 결과 에러 시 */}
            {error && <li className="py-2">에러가 발생했습니다.</li>}

            {/* 검색 결과 있을 시 */}
            {Array.isArray(spots) &&
              spots.length > 0 &&
              spots?.map((spot) => (
                <li
                  key={spot.id}
                  className="py-2 cursor-pointer hover:bg-grey1"
                >
                  <button onClick={(
                    e: React.MouseEvent<HTMLButtonElement>
                  ) => {
                    e.preventDefault();
                    handleGeocodingClick(spot.id)
                  }}>
                    {spot.displayName.text}
                  </button>
                </li>
              ))}

            {/* 검색 결과 없을 시 */}
            {Array.isArray(spots) && spots.length === 0 && (
              <li className="py-2">검색 결과가 없습니다.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModalCreateSelectionSpotSearchBar;
