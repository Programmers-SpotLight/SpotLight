import { ISpotInfoForMarking } from "@/models/selection";
import React, { useState } from "react";
import { SPOTINFOWITHCATEGORY } from "../spot-selection-contents/SpotHeader";
import Image from "next/image";

interface ISpotListProps {
  spotClickHandler: (spotId: string, lat: number, lng: number) => void;
  spotList: ISpotInfoForMarking[];
}

const SpotList = ({ spotClickHandler, spotList }: ISpotListProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSpotDetail = (
    index: number,
    spotId: string,
    lat: number,
    lng: number
  ) => {
    setSelectedIndex(index);
    spotClickHandler(spotId, lat, lng);
  };

  return (
    <ul className="flex flex-col gap-[5px] cursor-pointer">
      {spotList.map((spot, index) => (
        <li
          key={index}
          className={`flex items-center gap-[5px] text-grey4 font-medium text-medium p-[3px] pl-2 pr-2 box-border ${
            selectedIndex === index ? "bg-grey1" : ""
          } p-2 rounded-md`}
          onClick={() => handleSpotDetail(index, spot.id, spot.lat, spot.lng)}
        >
          <div className="relative w-4 h-4">
            <Image
              src={SPOTINFOWITHCATEGORY[spot.categoryName].icon}
              alt={SPOTINFOWITHCATEGORY[spot.categoryName].name}
              fill
            />
          </div>
          <span
            className={
              selectedIndex === index ? "text-primary font-bold" : "text-grey4"
            }
          >
            {spot.title}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default SpotList;
