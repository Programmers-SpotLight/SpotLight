"use client";

import GoogleMap from "@/components/google-map/GoogleMap";
import Drawer from "@/components/selection-detail/Drawer";
import ReviewModal from "@/components/selection-detail/review/ReviewModal";
import ReviewDeleteModal from "@/components/selection-detail/review/ReviewDeleteModal";
import ReviewImageModal from "@/components/selection-detail/review/ReviewImageModal";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MapLoading from "@/components/google-map/MapLoading";
import useSelectionDetail from "@/hooks/queries/useSelectionDetail";
import useErrorComponents from "@/hooks/useErrorComponents";

const SelectionPage = () => {
  const params = useParams();
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] =
    useState<boolean>(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<Buffer | null>(null);

  const {
    data: selectionData,
    isPending,
    isError,
    error
  } = useSelectionDetail(parseInt(params!.selectionId.toString(), 10));

  const ErrorComponent = useErrorComponents(error);

  useEffect(() => {
    if (selectionData && selectionData.spotList.length > 0) {
      setSelectedSpotId(selectionData.spotList[0].id);
    }
  }, [selectionData]);

  const toggleDrawer = () => {
    if (isSpotDrawerOpen) setIsSpotDrawerOpen((prev) => !prev);
    else if (!isSpotDrawerOpen) setIsSelectionDrawerOpen((prev) => !prev);
  };

  const spotClickHandler = (spotId: Buffer, lat?: number, lng?: number) => {
    setIsSelectionDrawerOpen(true);
    setIsSpotDrawerOpen(true);
    if (map && lat && lng) {
      map.panTo({ lat, lng });
    }
    setSelectedSpotId(spotId);
  };

  if (isPending)
    return (
      <div
        className="flex flex-col items-center justify-center gap-6"
        style={{ height: "calc(100vh - 74px)" }}
      >
        <MapLoading />
        <span className="text-lg font-bold text-grey4">
          셀렉션 정보를 불러오는 중입니다. 잠시만 기다려주세요.
        </span>
      </div>
    );

  if (isError) {
    return <div className={`h-[calc(100vh-74px)]`}>{ErrorComponent}</div>;
  }

  return (
    <div className={`relative h-[calc(100vh-74px)]`}>
      <GoogleMap
        width={
          isSelectionDrawerOpen && isSpotDrawerOpen
            ? "calc(100% - 750px)"
            : isSelectionDrawerOpen
            ? "calc(100% - 375px)"
            : "100%"
        }
        height="calc(100vh - 74px)"
        lat={selectionData.spotList[0].lat}
        lng={selectionData.spotList[0].lng}
        spots={selectionData.spotList}
        spotClickHandler={spotClickHandler}
        setMap={setMap}
      />
      {selectedSpotId && (
        <Drawer
          selectionData={selectionData}
          isSelectionDrawerOpen={isSelectionDrawerOpen}
          isSpotDrawerOpen={isSpotDrawerOpen}
          toggleDrawer={toggleDrawer}
          spotClickHandler={spotClickHandler}
          selectedSpotId={selectedSpotId}
        />
      )}
      <ReviewModal />
      <ReviewDeleteModal />
      <ReviewImageModal />
    </div>
  );
};

export default SelectionPage;
