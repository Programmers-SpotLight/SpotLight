import React, { useState } from "react";
import { FaCartShopping, FaLocationDot } from "react-icons/fa6";
import { MdFastfood, MdLocalCafe, MdTour } from "react-icons/md";

interface SpotListProps {
  spotClickHandler: () => void;
}

const tempSpotList = [ // UI 스타일용 임시 데이터입니다. 수정하시면 될 것 같습니다.
  {
    spotIcon: <FaLocationDot />,
    spotName: "도쿄 도립 무시노키타 고등학교",
  },
  { 
    spotIcon: <FaCartShopping />,
    spotName: "adhoc 신주쿠점",
  },
  {
    spotIcon: <MdFastfood />,
    spotName: "퍼스트 키친 신주쿠점",
  },
  {
    spotIcon: <MdLocalCafe />,
    spotName: "스타벅스 신주쿠점",
  },
  {
    spotIcon: <MdTour />,
    spotName: "쇼난카이 해안 공원",
  },
];

const SpotList = ({ spotClickHandler }: SpotListProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSpotDetail = (index: number) => {
    setSelectedIndex(index);
    spotClickHandler();
  };

  return (
    <ul className="flex flex-col gap-[5px] cursor-pointer">
      {tempSpotList.map((spot, index) => (
        <li
          key={index}
          className={`flex items-center gap-[5px] text-grey4 font-medium text-medium p-[3px] pl-2 pr-2 box-border ${
            selectedIndex === index ? "bg-grey1" : ""
          } p-2 rounded-md`}
          onClick={() => handleSpotDetail(index)}
        >
          <span
            className={selectedIndex === index ? "text-primary" : "text-grey4"}
          >
            {spot.spotIcon}
          </span>
          <span
            className={selectedIndex === index ? "text-primary font-bold" : "text-grey4"}
          >
            {spot.spotName}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default SpotList;
