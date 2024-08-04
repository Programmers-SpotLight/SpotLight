import Image from "next/image";
import React from "react";
import { LuMapPin } from "react-icons/lu";

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

interface ISpotHeaderProps {
  images: string[];
  categoryName: string;
  title: string;
  address: string;
  hashtag: string[];
}

const SpotHeader = ({
  images,
  categoryName,
  title,
  address,
  hashtag
}: ISpotHeaderProps) => {
  const filtered = spots.filter((spot) => spot.name === categoryName)[0];
  return (
    <>
      <div className="w-full h-[194px] relative mb-5">
        <Image
          src={images[0]}
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
            style={{ color: filtered.color }}
          >
            <div className="relative w-4 h-4">
              <Image src={filtered.icon} alt={filtered.name} fill />
            </div>
            {filtered.name}
          </div>
          {/**title */}
          <span className="font-bold text-large">{title}</span>
          {/**address */}
          <div className="font-medium text-extraSmall text-grey4 flex items-center gap-1">
            <LuMapPin />
            {address}
          </div>
          {/**hashtag */}
          <div className="flex gap-3 flex-wrap">{hashtag.map((h) => h)}</div>
        </div>
      </div>
    </>
  );
};

export default SpotHeader;
