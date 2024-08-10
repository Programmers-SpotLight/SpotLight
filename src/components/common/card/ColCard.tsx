import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoMdLock } from "react-icons/io";
import { MdOutlineThumbUp, MdThumbUp } from "react-icons/md";
import { usePathname } from "next/navigation";
import { TselectionStatus } from "@/models/searchResult.model";
import { Ihashtags } from "@/models/hashtag.model";
import Hashtag from "../Hashtag";

export interface IBaseCardProps {
  thumbnail: string;
  title: string;
  category: string;
  region?: string;
  description: string;
  selectionId: number;
}

export interface IColCardProps extends IBaseCardProps {
  userName?: string;
  userImage?: string;
  likes?: number;
  liked?: boolean;
  hashtags: Ihashtags[];
  status: TselectionStatus;
  onClick?: () => void;
}

const ColCard = ({
  thumbnail,
  title,
  category,
  region,
  description,
  userName,
  userImage,
  likes,
  liked,
  hashtags,
  selectionId,
  status = "public",
  onClick
}: IColCardProps) => {
  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  const pathname = usePathname();

  return (
    <Link
      href={`/selection/${selectionId}`}
      className={`flex flex-col w-[248px] ${
        userImage && userName ? "h-[389px]" : "h-[355px]"
      } rounded-lg border-[0.5px] border-solid border-grey2 hover:brightness-75 bg-white`}
    >
      <div className="relative w-full h-[178px]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority
            className="rounded-t-lg object-cover"
            sizes="width : 100%, height : 178px"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white font-bold text-large bg-grey2">spotlight</div>
        )}

        {status === "private" && (
          <IoMdLock
            className="absolute top-2 right-2"
            fill="#7C7C7C"
            size={22}
          />
        )}
      </div>

      <div className="px-2 py-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <p className="text-grey4 mb-2 text-extraSmall font-semibold">
            {category}
            {region && ` / ${region}`}
          </p>
          {pathname === "/mypage" && (
            <GoKebabHorizontal
              fill="#7C7C7C"
              className="rotate-90 z-10"
              size={12}
              onClick={handleIconClick}
            />
          )}
        </div>

        <p className="font-bold mb-3 text-medium line-clamp-1">{title}</p>

        <div className="mb-5 flex overflow-hidden">
          {hashtags.map((tag) => (
            <li className="list-none" key={tag.htag_id}>
              <Hashtag name={tag.htag_name} size="small" />
            </li>
          ))}
        </div>

        <p className="text-grey4 line-clamp-3 text-extraSmall font-medium h-9  ">
          {description}
        </p>

        {userImage && userName && (
          <div className="flex justify-between items-center text-grey4 mt-auto">
            <div className="flex items-center gap-1">
              <div className="relative w-[16px] h-[16px]">
                {userImage ?
                <Image
                  src={userImage}
                  alt={userName}
                  className="rounded-full object-cover"
                  fill
                /> :
                <div className="w-full h-full flex justify-center items-center font-bold text-large"/>
              }
              </div>
              <span className="text-extraSmall font-semibold">{userName}</span>
            </div>

            <div className="flex items-center gap-1">
              {liked ? (
                <MdThumbUp size={16} fill="#7C7C7C" />
              ) : (
                <MdOutlineThumbUp size={16} />
              )}
              <span className="text-extraSmall font-medium">{likes}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ColCard;
