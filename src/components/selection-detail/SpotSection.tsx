import React from "react";

interface ISpotSectionProps {
  isSelectionDrawerOpen: boolean;
  isSpotDrawerOpen: boolean;
}

const SpotSection = ({
  isSpotDrawerOpen,
  isSelectionDrawerOpen
}: ISpotSectionProps) => {
  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen ? "-translate-x-full" : "-translate-x-[200%]"
      }
        ${isSpotDrawerOpen ? "translate-x-0" : "-translate-x-full"}
      } transition- ease-in-out duration-500
border-[0.5px] border-grey2 border-solid overflow-hidden w-[375px]`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      1. 위치와 접근성 👍 가마쿠라코코마에 역은 도쿄에서 남서쪽으로 약 50km
      떨어진 가나가와현에 위치해 있어요. 도쿄에서 출발하는 경우, JR 요코스카
      선을 타고 요코하마에서 에노시마 전철로 갈아타면 쉽게 도착할 수 있습니다.
      여행자들이 많이 이용하는 경로라서 표지판과 안내도 잘 되어 있어요. 2.
      슬램덩크와의 인연🐱 가마쿠라코코마에 역은 인기 만화 ‘슬램덩크’의 무대로
      유명합니다. 만화 속 주인공들이 자주 지나가는 배경으로 등장하면서 팬들
      사이에서 성지순례 코스로 자리잡게 되었죠. 역 주변의 풍경은 만화에서 본
      그대로입니다. 특히 역에서 바다를 배경으로 서 있는 그 장면은 정말
      인상적이에요. 실제로 이곳에 서 있으면 만화 속 주인공이 된 듯한 기분을 느낄
      수 있답니다. 3. 역 주변의 매력😊 역 바로 앞에 펼쳐진 바다는 정말
      아름다워요. 푸른 바다와 하늘이 맞닿아 있는 풍경은 말로 표현할 수 없을 만큼
      멋지죠. 날씨가 좋은 날에는 에노시마 섬도 보입니다. 해변을 따라 산책을
      즐기거나, 자전
    </div>
  );
};

export default SpotSection;
