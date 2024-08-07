import Hashtag from "@/components/common/Hashtag";
import { ISpotImage, SpotCategory } from "@/models/spot";
import { useModalStore } from "@/stores/modalStore";
import Image from "next/image";
import React from "react";
import { LuMapPin } from "react-icons/lu";
import { useStore } from "zustand";

interface ISpot {
  name: string;
  icon: string;
  mapPin: string;
  color: string;
}

export const SPOTINFOWITHCATEGORY: { [key in SpotCategory]: ISpot } = {
  관광지: {
    name: "관광지",
    icon: "/icons/spot/관광지.svg",
    mapPin: "/icons/map-pin/맵핀-관광지.svg",
    color: "#8CDC29"
  },
  맛집: {
    name: "맛집",
    icon: "/icons/spot/맛집.svg",
    mapPin: "/icons/map-pin/맵핀-맛집.svg",
    color: "#F58E34"
  },
  쇼핑: {
    name: "쇼핑",
    icon: "/icons/spot/쇼핑.svg",
    mapPin: "/icons/map-pin/맵핀-쇼핑.svg",
    color: "#3478F5"
  },
  카페: {
    name: "카페",
    icon: "/icons/spot/카페.svg",
    mapPin: "/icons/map-pin/맵핀-카페.svg",
    color: "#B9781E"
  },
  기타: {
    name: "기타",
    icon: "/icons/spot/기타.svg",
    mapPin: "/icons/map-pin/맵핀-기타.svg",
    color: "#534457"
  }
};

interface ISpotHeaderProps {
  images: ISpotImage[];
  categoryName: SpotCategory;
  title: string;
  address: string;
  hashtags: string[];
}

const SpotHeader = ({
  images,
  categoryName,
  title,
  address,
  hashtags
}: ISpotHeaderProps) => {
  const { openModal } = useStore(useModalStore);

  return (
    <>
      <div
        className="w-full h-[194px] relative mb-5"
        onClick={() => openModal("images", { images, title })}
      >
        <Image
          src={images[0].url}
          alt="spot image"
          fill
          sizes="width:100%, height:194px"
          className="cursor-pointer"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute bottom-0 right-0 rounded-tl-md bg-black w-11 h-7 text-white flex items-center justify-center text-medium font-bold">
          + {images.length - 1}
        </div>
      </div>

      <div className="px-4">
        <div className="flex flex-col gap-2">
          {/** spot category */}
          <div
            className={`text-small font-semibold flex items-center gap-2`}
            style={{ color: SPOTINFOWITHCATEGORY[categoryName].color }}
          >
            <div className="relative w-4 h-4">
              <Image
                src={SPOTINFOWITHCATEGORY[categoryName].icon}
                alt={SPOTINFOWITHCATEGORY[categoryName].name}
                fill
              />
            </div>
            {SPOTINFOWITHCATEGORY[categoryName].name}
          </div>
          {/**title */}
          <span className="font-bold text-large">{title}</span>
          {/**address */}
          <div className="font-medium text-extraSmall text-grey4 flex items-center gap-1">
            <LuMapPin />
            {address}
          </div>
          {/**hashtag */}
          <div className="flex">
            {hashtags.map((hashtag) => (
              <Hashtag size="big" name={hashtag} key={hashtag} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotHeader;
