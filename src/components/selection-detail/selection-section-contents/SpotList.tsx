import React from "react";
import { SPOTINFOWITHCATEGORY } from "../spot-selection-contents/SpotHeader";
import Image from "next/image";
import { ISpotInfo } from "@/models/spot";

interface ISpotListProps {
  spotClickHandler: (spotId: number, lat: number, lng: number) => void;
  spotList: ISpotInfo[];
  selectedSpotId: number | null;
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
          key={spot.id}
          className={`flex items-center gap-[5px] text-grey4 font-medium text-medium p-[3px] pl-2 pr-2 box-border ${
            selectedSpotId === parseInt(spot.id, 10) ? "bg-grey1" : ""
          } p-2 rounded-md`}
          onClick={() =>
            spotClickHandler(parseInt(spot.id, 10), spot.lat, spot.lng)
          }
        >
          <div className="relative w-4 h-4">
            <Image
              src={SPOTINFOWITHCATEGORY[spot.category.name].icon}
              alt={SPOTINFOWITHCATEGORY[spot.category.name].name}
              fill
            />
          </div>
          <span
            className={
              selectedSpotId === parseInt(spot.id, 10)
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
