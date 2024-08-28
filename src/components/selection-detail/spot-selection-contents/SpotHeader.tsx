import Hashtag from "@/components/common/Hashtag";
import Spinner from "@/components/common/Spinner";
import { Ihashtags } from "@/models/hashtag.model";
import { ISpotImage, SpotCategory } from "@/models/spot.model";
import { useModalStore } from "@/stores/modalStore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  images: ISpotImage[] | undefined;
  categoryName: SpotCategory;
  title: string;
  address: string;
  hashtags: Ihashtags[];
}

const SpotHeader = ({
  images,
  categoryName,
  title,
  address,
  hashtags
}: ISpotHeaderProps) => {
  const { openModal } = useStore(useModalStore);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [title]);

  images && images.sort((a, b) => b.order - a.order);

  const imageClickHandler = () => {
    if (!images) return;
    openModal("images", { images, title });
  };

  return (
    <>
      <div
        className="w-full h-[194px] relative mb-5"
        onClick={imageClickHandler}
      >
        {images && images.length ? (
          <>
            <div className="w-full h-[194px] cursor-pointer relative">
              {isLoading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Spinner size="small" />
                </div>
              )}
              <Image
                src={images[0].url}
                alt="spot image"
                fill
                sizes="width:375px height:194px"
                onLoadingComplete={() => setIsLoading(false)}
                style={{ visibility: isLoading ? "hidden" : "visible" }}
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 right-0 rounded-tl-md bg-black w-11 h-7 text-white flex items-center justify-center text-medium font-bold">
              + {images.length - 1}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white font-bold text-large bg-grey2">
            spotlight
          </div>
        )}
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
              <Hashtag
                size="big"
                name={hashtag.htag_name}
                key={hashtag.htag_id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotHeader;
