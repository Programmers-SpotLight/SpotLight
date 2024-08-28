"use client";

import GoogleMap from "@/components/google-map/GoogleMap";
import Drawer from "@/components/selection-detail/Drawer";
import ReviewImageModal from "@/components/selection-detail/review/ReviewImageModal";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapLoading from "@/components/google-map/MapLoading";
import useSelectionDetail from "@/hooks/queries/useSelectionDetail";
import useErrorComponents from "@/hooks/useErrorComponents";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const SelectionPage = () => {
  const params = useParams();
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] =
    useState<boolean>(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<Buffer | null>(null);
  const prevSelectedSpotId = useRef<Buffer | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: selectionData,
    isPending,
    isError,
    error
  } = useSelectionDetail(parseInt(params!.selectionId.toString(), 10));

  const ErrorComponent = useErrorComponents(error);

  useEffect(() => {
    if (prevSelectedSpotId.current)
      setSelectedSpotId(prevSelectedSpotId.current);
    else if (selectionData && selectionData.spotList.length > 0) {
      setSelectedSpotId(selectionData.spotList[0].id);
    }
  }, [selectionData]);

  useEffect(() => {
    if (selectedSpotId !== prevSelectedSpotId.current) {
      prevSelectedSpotId.current = selectedSpotId;
    }
  }, [selectedSpotId]);

  useEffect(() => {
    if (!selectionData) return;

    if (selectionData.status === "delete") {
      toast.error("존재하지 않는 셀렉션 정보입니다.", {
        position: "top-center"
      });
      router.replace("/");
    } else if (
      selectionData.status === "private" &&
      selectionData.writerId !== session?.user.id
    ) {
      toast.error("해당 셀렉션은 비공개 처리되었습니다.", {
        position: "top-center"
      });
      router.replace("/");
    }
  }, [selectionData, session, router]);

  const toggleDrawer = useCallback(() => {
    if (isSpotDrawerOpen) setIsSpotDrawerOpen((prev) => !prev);
    else if (!isSpotDrawerOpen) setIsSelectionDrawerOpen((prev) => !prev);
  }, [isSpotDrawerOpen]);

  const spotClickHandler = useCallback(
    (spotId: Buffer, lat?: number, lng?: number) => {
      setIsSelectionDrawerOpen(true);
      setIsSpotDrawerOpen(true);
      if (map && lat && lng) {
        map.panTo({ lat, lng });
      }
      setSelectedSpotId(spotId);
    },
    [map]
  );

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
    return ErrorComponent;
  }

  if (!selectionData) return null;

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
      <ReviewImageModal />
    </div>
  );
};

export default SelectionPage;
