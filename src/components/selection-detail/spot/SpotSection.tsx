import { Tab, Tabs } from "@/components/common/Tabs";
import { useModalStore } from "@/stores/modalStore";
import Image from "next/image";
import React from "react";
import { LuMapPin } from "react-icons/lu";
import { useStore } from "zustand";

interface ISpotSectionProps {
  isSelectionDrawerOpen: boolean;
  isSpotDrawerOpen: boolean;
}

interface ISpot {
  name: string;
  icon: string;
  color: string;
}

type Spots = ISpot[];

const spots: Spots = [
  {
    name: "관광지",
    icon: "/icons/spot/관광지.svg",
    color: "#8CDC29"
  },
  {
    name: "맛집",
    icon: "/icons/spot/맛집.svg",
    color: "#F58E34"
  },
  {
    name: "쇼핑",
    icon: "/icons/spot/쇼핑.svg",
    color: "#3478F5"
  },
  {
    name: "카페",
    icon: "/icons/spot/카페.svg",
    color: "#B9781E"
  },
  {
    name: "기타",
    icon: "/icons/spot/기타.svg",
    color: "#F53454"
  }
];

const hashtag = (
  <div className="h-7 border-2 border-solid border-black rounded-3xl w-fit">
    슬램덩크
  </div>
);
const sampleSpot = {
  image: ["/샌과치히로.jpg", "/샌과치히로.jpg", "/샌과치히로.jpg"],
  spotCategoryName: "기타",
  title: "가마쿠라코코마에역",
  description: `1. 위치와 접근성 👍
가마쿠라코코마에 역은 도쿄에서 남서쪽으로 약 50km 떨어진 가나가와현에 위치해 있어요. 도쿄에서 출발하는 경우, JR 요코스카 선을 타고 요코하마에서 에노시마 전철로 갈아타면 쉽게 도착할 수 있습니다. 여행자들이 많이 이용하는 경로라서 표지판과 안내도 잘 되어 있어요.

2. 슬램덩크와의 인연🐱
가마쿠라코코마에 역은 인기 만화 ‘슬램덩크’의 무대로 유명합니다. 만화 속 주인공들이 자주 지나가는 배경으로 등장하면서 팬들 사이에서 성지순례 코스로 자리잡게 되었죠. 역 주변의 풍경은 만화에서 본 그대로입니다. 특히 역에서 바다를 배경으로 서 있는 그 장면은 정말 인상적이에요. 실제로 이곳에 서 있으면 만화 속 주인공이 된 듯한 기분을 느낄 수 있답니다.

3. 역 주변의 매력😊
역 바로 앞에 펼쳐진 바다는 정말 아름다워요. 푸른 바다와 하늘이 맞닿아 있는 풍경은 말로 표현할 수 없을 만큼 멋지죠. 날씨가 좋은 날에는 에노시마 섬도 보입니다. 해변을 따라 산책을 즐기거나, 자전거를 대여해서 주변을 둘러보는 것도 좋은 방법이에요.

4. 사진 명소❤️
가마쿠라코코마에 역은 사진 찍기 좋은 명소로도 유명합니다. 특히 해질녘의 풍경은 환상적이에요. 석양이 바다를 물들이는 순간은 정말 아름답습니다. 이곳에서 찍은 사진은 인스타그램 등 SNS에 올리면 반응이 아주 뜨거울 거예요. 제가 방문했을 때도 많은 사람들이 카메라를 들고 사진을 찍느라 여념이 없더라고요.`,
  address: "일본 〒248-0033 가나가와현 가마쿠라시 고시고에 1 조메1",
  hashtag: [hashtag, hashtag, hashtag, hashtag, hashtag, hashtag]
};

const SpotSection = ({
  isSpotDrawerOpen,
  isSelectionDrawerOpen
}: ISpotSectionProps) => {
  const filtered = spots.filter(
    (spot) => spot.name === sampleSpot.spotCategoryName
  )[0];

  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen && isSpotDrawerOpen
          ? "translate-x-0"
          : isSelectionDrawerOpen
          ? "-translate-x-full"
          : "-translate-x-[200%]"
      }
      transition- ease-in-out duration-500
border-[0.5px] border-grey2 border-solid overflow-y-scroll w-[375px]`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      <div className="w-full h-[194px] relative mb-5">
        <Image
          src={"/샌과치히로.jpg"}
          alt="spot image"
          fill
          sizes="width:100%, height:194px"
          className="cursor-pointer"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute bottom-0 right-0 rounded-tl-md bg-black w-11 h-7 text-white flex items-center justify-center text-medium font-bold">
          + {sampleSpot.image.length - 1}
        </div>
      </div>

      <div className="px-4">
        <div className="flex flex-col gap-2">
          {/** spot category */}
          <div
            className={`text-small font-semibold flex items-center gap-2`}
            style={{ color: filtered.color }}
          >
            <div className="relative w-4 h-4">
              <Image src={filtered.icon} alt={filtered.name} fill />
            </div>
            {filtered.name}
          </div>
          {/**title */}
          <span className="font-bold text-large">{sampleSpot.title}</span>
          {/**address */}
          <div className="font-medium text-extraSmall text-grey4 flex items-center gap-1">
            <LuMapPin />
            {sampleSpot.address}
          </div>
          {/**hashtag */}
          <div className="flex gap-3 flex-wrap">
            {sampleSpot.hashtag.map((h) => h)}
          </div>
        </div>

        <hr className="my-5 text-grey0" />

        <Tabs>
          <Tab title="스팟 정보">
            <p className="whitespace-pre-wrap break-keep">
              {sampleSpot.description}
            </p>
          </Tab>
          <Tab title="유저 리뷰">
            <p>유저 리뷰</p>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default SpotSection;
