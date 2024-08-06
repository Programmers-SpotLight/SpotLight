"use client";

import GoogleMap from "@/components/google-map/GoogleMap";
import Drawer from "@/components/selection-detail/Drawer";
import { ISelectionDetail } from "@/models/selection";
import { SpotCategory } from "@/models/spot";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const selectionData: ISelectionDetail = {
  title: "슬램덩크 무대 탐방 공유합니다!",
  description:
    "제가 이전에 도쿄 다녀왔을 때 한번 구경해봤던 슬램덩크 무대탐방 장소입니다. 바쁘시면 가마쿠라코코마에역이라도 꼭 가보세요 완전강추!",
  category: {
    id: 1,
    name: "애니메이션"
  },
  user: {
    id: 1,
    nickname: "이창우",
    image:
      "https://ilyo.co.kr/contents/article/images/2023/1102/1698901514791536.jpg"
  },
  location: {
    is_world: true,
    region: "아시아"
  },
  image:
    "https://i.namu.wiki/i/O0u4__0DlY6tc9-S505SLruRy-q4ZOJ44-SHzBhGNsHVsUfnx5wE5mOB0XMCY6hloGXzRrfF7WXuu2nmGUNQhA.webp",
  hashtags: [
    "슬램덩크",
    "슬램덩크 무대탐방",
    "당일치기",
    "도쿄",
    "북산고",
    "정대만"
  ],
  status: null,
  spot_list: [
    {
      id: "1",
      lat: 39,
      lng: -6,
      categoryName: "맛집" as SpotCategory,
      title: "도쿄 도립 무시노키타 고등학교"
    },
    {
      id: "2",
      lat: 39.01,
      lng: -6,
      categoryName: "쇼핑" as SpotCategory,
      title: "adhoc 신주쿠점"
    },
    {
      id: "3",
      lat: 39.02,
      lng: -6,
      categoryName: "카페" as SpotCategory,
      title: "퍼스트 키친 신주쿠점"
    },
    {
      id: "4",
      lat: 39.03,
      lng: -6,
      categoryName: "관광지" as SpotCategory,
      title: "후지사와 역"
    },
    {
      id: "5",
      lat: 39.04,
      lng: -6,
      categoryName: "기타" as SpotCategory,
      title: "쇼난카이 해안공원(카나가와)"
    }
  ],
  booked: true
};

const SelectionPage = () => {
  const params = useParams();
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] =
    useState<boolean>(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const toggleDrawer = () => {
    if (isSpotDrawerOpen) setIsSpotDrawerOpen((prev) => !prev);
    else if (!isSpotDrawerOpen) setIsSelectionDrawerOpen((prev) => !prev);
  };

  const spotClickHandler = (spotId: string, lat?: number, lng?: number) => {
    setIsSelectionDrawerOpen(true);
    setIsSpotDrawerOpen(true);
    if (map && lat && lng) {
      map.panTo({ lat, lng });
    }
    setSelectedSpotId(spotId);
  };

  if (!params) {
    return <div>올바르지 않은 selectionId</div>;
  }

  const selectionId = params.selectionId;

  return (
    <div className="relative">
      <GoogleMap
        width="100%"
        height="calc(100vh - 74px)"
        lat={selectionData.spot_list[0].lat}
        lng={selectionData.spot_list[0].lng}
        spots={selectionData.spot_list}
        spotClickHandler={spotClickHandler}
        setMap={setMap}
      />
      <Drawer
        selectionData={selectionData}
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        isSpotDrawerOpen={isSpotDrawerOpen}
        toggleDrawer={toggleDrawer}
        spotClickHandler={spotClickHandler}
        selectedSpotId={selectedSpotId}
      />
    </div>
  );
};

export default SelectionPage;
