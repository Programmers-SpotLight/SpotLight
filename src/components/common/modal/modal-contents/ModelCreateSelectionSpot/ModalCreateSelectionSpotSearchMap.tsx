import useReverseGeocoding from "@/hooks/useReverseGeocoding";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { useStore } from "zustand";

const ModalCreateSelectionSpotSearchMap = () => {
  const reverseGeocodingRequested = useRef(false);
  const map = useMap();

  const {
    selectedLocation,
    setSelectedLocation,
    currentCoordinate,
    setCurrentCoordinate
  } = useStore(useSelectionSpotCreateStore);

  const {
    address: reverseGeocodingAddress,
    placeId: reverseGeocodingPlaceId,
    fetchAddress,
    loading: reverseGeocodingLoading,
    error: reverseGeocodingError
  } = useReverseGeocoding();

  const handleReverseGeocodingClick = () => {
    if (
      selectedLocation.location.lat != currentCoordinate.lat ||
      selectedLocation.location.lng != currentCoordinate.lng
    ) {
      reverseGeocodingRequested.current = true;
      fetchAddress(currentCoordinate.lat, currentCoordinate.lng);
    }
  };

  const handleDragEnd = (event: google.maps.MapMouseEvent) => {
    const { lat, lng } = event.latLng?.toJSON() || { lat: 0, lng: 0 };
    setCurrentCoordinate({ lat, lng });
  };

  const handleMoveToMarkerClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    map?.panTo(currentCoordinate);
  };

  const decideInitialCoordinate = () => {
    if (
      selectedLocation.location.lat != 0 &&
      selectedLocation.location.lng != 0
    ) {
      return selectedLocation.location;
    }
    return currentCoordinate;
  };

  // 역지오코딩 결과 처리
  useEffect(() => {
    // 처음 렌더링 시 실행되지 않도록
    if (!reverseGeocodingRequested.current) {
      return;
    }
    if (reverseGeocodingLoading) return;
    if (reverseGeocodingError) {
      return;
    }

    setSelectedLocation({
      ...selectedLocation,
      address: reverseGeocodingAddress || "",
      placeId: reverseGeocodingPlaceId || "",
      location: currentCoordinate
    });

    map?.setCenter(currentCoordinate || { lat: 0, lng: 0 });
  }, [
    reverseGeocodingLoading,
    reverseGeocodingError,
    reverseGeocodingAddress,
    reverseGeocodingPlaceId
  ]);

  return (
    <Map
      style={{ width: "100%", height: "280px", position: "relative" }}
      defaultZoom={13}
      defaultCenter={decideInitialCoordinate()}
      streetViewControl={false}
      mapTypeControl={false}
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
      reuseMaps={true}
    >
      <div className="absolute bottom-[8%] left-[2%] flex flex-col items-stretch gap-2">
        <button
          className="bg-primary p-3 text-white font-medium block w-[142px] rounded-lg text-sm"
          onClick={handleMoveToMarkerClick}
        >
          마커로 이동
        </button>
        {(selectedLocation.location.lat !== currentCoordinate.lat ||
          selectedLocation.location.lng !== currentCoordinate.lng) && (
          <button
            className="bg-primary p-3 text-white font-medium block w-[142px] rounded-lg text-sm"
            onClick={handleReverseGeocodingClick}
          >
            현재 위치 주소 설정
          </button>
        )}
      </div>
      <AdvancedMarker
        draggable={true}
        onDragEnd={handleDragEnd}
        position={currentCoordinate}
        title={"스팟 위치"}
      />
    </Map>
  );
};

export default ModalCreateSelectionSpotSearchMap;
