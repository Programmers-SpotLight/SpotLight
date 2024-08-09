import React from "react";
import { SPOTINFOWITHCATEGORY } from "../spot-selection-contents/SpotHeader";
import Image from "next/image";
import { ISpotInfo } from "@/models/spot";

interface ISpotListProps {
  spotClickHandler: (spotId: string, lat: number, lng: number) => void;
  spotList: ISpotInfo[];
  selectedSpotId: string | null;
}

const SpotList = ({
  spotClickHandler,
  spotList,
  selectedSpotId
}: ISpotListProps) => {
  return (
    <ul className="flex flex-col gap-[5px] cursor-pointer">
      {spotList.map((spot) => (
        <li
          key={spot.lat}
          className={`flex items-center gap-[5px] text-grey4 font-medium text-medium p-[3px] pl-2 pr-2 box-border ${
            selectedSpotId === spot.id ? "bg-grey1" : ""
          } p-2 rounded-md`}
          onClick={() => spotClickHandler(spot.id, spot.lat, spot.lng)}
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
              selectedSpotId === spot.id
                ? "text-primary font-bold"
                : "text-grey4"
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
