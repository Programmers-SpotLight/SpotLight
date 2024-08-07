"use client";

import GoogleMap from "@/components/google-map/GoogleMap";
import Drawer from "@/components/selection-detail/Drawer";
import { useSelection } from "@/hooks/useSelection";
import { ISelectionInfo } from "@/models/selection";
import ReviewModal from "@/components/selection-detail/review/ReviewModal";
import ReviewDeleteModal from "@/components/selection-detail/review/ReviewDeleteModal";
import ReviewImageModal from "@/components/selection-detail/review/ReviewImageModal";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// const selectionData: ISelectionInfo = {
//   id: 1,
//   title: "슬램덩크 무대 탐방 공유합니다!",
//   description:
//     "제가 이전에 도쿄 다녀왔을 때 한번 구경해봤던 슬램덩크 무대탐방 장소입니다. 바쁘시면 가마쿠라코코마에역이라도 꼭 가보세요 완전강추!",
//   categoryId: 1,
//   categoryName: "애니메이션",
//   user: {
//     id: 1,
//     nickname: "이창우",
//     image:
//       "https://ilyo.co.kr/contents/article/images/2023/1102/1698901514791536.jpg"
//   },
//   location: "아시아",
//   image:
//     "https://i.namu.wiki/i/O0u4__0DlY6tc9-S505SLruRy-q4ZOJ44-SHzBhGNsHVsUfnx5wE5mOB0XMCY6hloGXzRrfF7WXuu2nmGUNQhA.webp",
//   hashtags: [
//     "슬램덩크",
//     "슬램덩크 무대탐방",
//     "당일치기",
//     "도쿄",
//     "북산고",
//     "정대만"
//   ],
//   status: null,
//   spotList: [
//     {
//       id: "1",
//       title: "가마쿠라코코마에역",
//       images: [
//         {
//           url: "/imgs/경복궁사진.png",
//           order: 1
//         }
//       ],
//       categoryId: 1,
//       categoryName: "관광지",
//       description: `1. 위치와 접근성 👍
// 가마쿠라코코마에 역은 도쿄에서 남서쪽으로 약 50km 떨어진 가나가와현에 위치해 있어요. 도쿄에서 출발하는 경우, JR 요코스카 선을 타고 요코하마에서 에노시마 전철로 갈아타면 쉽게 도착할 수 있습니다. 여행자들이 많이 이용하는 경로라서 표지판과 안내도 잘 되어 있어요.

// 2. 슬램덩크와의 인연🐱
// 가마쿠라코코마에 역은 인기 만화 ‘슬램덩크’의 무대로 유명합니다. 만화 속 주인공들이 자주 지나가는 배경으로 등장하면서 팬들 사이에서 성지순례 코스로 자리잡게 되었죠. 역 주변의 풍경은 만화에서 본 그대로입니다. 특히 역에서 바다를 배경으로 서 있는 그 장면은 정말 인상적이에요. 실제로 이곳에 서 있으면 만화 속 주인공이 된 듯한 기분을 느낄 수 있답니다.

// 3. 역 주변의 매력😊
// 역 바로 앞에 펼쳐진 바다는 정말 아름다워요. 푸른 바다와 하늘이 맞닿아 있는 풍경은 말로 표현할 수 없을 만큼 멋지죠. 날씨가 좋은 날에는 에노시마 섬도 보입니다. 해변을 따라 산책을 즐기거나, 자전거를 대여해서 주변을 둘러보는 것도 좋은 방법이에요.

// 4. 사진 명소❤️
// 가마쿠라코코마에 역은 사진 찍기 좋은 명소로도 유명합니다. 특히 해질녘의 풍경은 환상적이에요. 석양이 바다를 물들이는 순간은 정말 아름답습니다. 이곳에서 찍은 사진은 인스타그램 등 SNS에 올리면 반응이 아주 뜨거울 거예요. 제가 방문했을 때도 많은 사람들이 카메라를 들고 사진을 찍느라 여념이 없더라고요.

// 4. 사진 명소❤️
// 가마쿠라코코마에 역은 사진 찍기 좋은 명소로도 유명합니다. 특히 해질녘의 풍경은 환상적이에요. 석양이 바다를 물들이는 순간은 정말 아름답습니다. 이곳에서 찍은 사진은 인스타그램 등 SNS에 올리면 반응이 아주 뜨거울 거예요. 제가 방문했을 때도 많은 사람들이 카메라를 들고 사진을 찍느라 여념이 없더라고요.`,
//       address: "일본 〒248-0033 가나가와현 가마쿠라시 고시고에 1 조메1",
//       hashtags: ["슬램덩크", "슬램덩크2"],
//       lat: 37,
//       lng: 31,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       gmapId: "1"
//     },
//     {
//       id: "2",
//       title: "adhoc 신주쿠점",
//       images: [
//         {
//           url: "/imgs/경복궁사진2.png",
//           order: 1
//         }
//       ],
//       categoryId: 2,
//       categoryName: "맛집",
//       description: `1. 위치와 접근성 👍
// 가마쿠라코코마에 역은 도쿄에서 남서쪽으로 약 50km 떨어진 가나가와현에 위치해 있어요. 도쿄에서 출발하는 경우, JR 요코스카 선을 타고 요코하마에서 에노시마 전철로 갈아타면 쉽게 도착할 수 있습니다. 여행자들이 많이 이용하는 경로라서 표지판과 안내도 잘 되어 있어요.
// `,
//       address: "경기도 화성시 ㅁㄴㅇㄴㅁㅇㅁㄴㅁ",
//       hashtags: ["defbjiksad", "abc"],
//       lat: 37.01,
//       lng: 31,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       gmapId: "2"
//     },
//     {
//       id: "3",
//       title: "퍼스트 키친 신주쿠점",
//       images: [
//         {
//           url: "/imgs/경복궁사진3.jpg",
//           order: 1
//         },
//         {
//           url: "/imgs/샌과치히로.jpg",
//           order: 1
//         }
//       ],
//       categoryId: 2,
//       categoryName: "쇼핑",
//       description: `2. 슬램덩크와의 인연🐱
// 가마쿠라코코마에 역은 인기 만화 ‘슬램덩크’의 무대로 유명합니다. 만화 속 주인공들이 자주 지나가는 배경으로 등장하면서 팬들 사이에서 성지순례 코스로 자리잡게 되었죠. 역 주변의 풍경은 만화에서 본 그대로입니다. 특히 역에서 바다를 배경으로 서 있는 그 장면은 정말 인상적이에요. 실제로 이곳에 서 있으면 만화 속 주인공이 된 듯한 기분을 느낄 수 있답니다.
// `,
//       address: "경기도 서울 동작구 ㅇㅁㄴㅇㄴㅁㅇ",
//       hashtags: ["12314314", "12312312"],
//       lat: 37.02,
//       lng: 31,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       gmapId: "3"
//     }
//   ],
//   booked: true,
//   createdAt: new Date(),
//   updatedAt: new Date()
// };

const SelectionPage = () => {
  const params = useParams();
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] =
    useState<boolean>(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const { selectionData, isPending, isError } = useSelection(
    params!.selectionId
  );

  useEffect(() => {
    if (selectionData && selectionData.spotList.length > 0) {
      setSelectedSpotId(selectionData.spotList[0].id); 
    }
  }, [selectionData]);

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

  if (isPending) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

  return (
    <div className="relative">
      <GoogleMap
        width="100%"
        height="calc(100vh - 74px)"
        lat={selectionData.spotList[0].lat}
        lng={selectionData.spotList[0].lng}
        spots={selectionData.spotList}
        spotClickHandler={spotClickHandler}
        setMap={setMap}
      />
      {selectedSpotId && <Drawer
        selectionData={selectionData}
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        isSpotDrawerOpen={isSpotDrawerOpen}
        toggleDrawer={toggleDrawer}
        spotClickHandler={spotClickHandler}
        selectedSpotId={selectedSpotId}
      />}
      <ReviewModal />
      <ReviewDeleteModal />
      <ReviewImageModal />
    </div>
  );
};

export default SelectionPage;
