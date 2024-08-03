"use client";

import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, use } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoMdLock } from "react-icons/io";
import { MdOutlineThumbUp, MdThumbUp } from "react-icons/md";
import { usePathname } from "next/navigation";

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
  hashtags: ReactNode[];
  isPublic: boolean;
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
  isPublic = true,
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
        <Image
          src={thumbnail}
          alt={title}
          fill
          priority
          className="rounded-t-lg object-cover"
          sizes="width : 100%, height : 178px"
        />
        {!isPublic && (
          <IoMdLock
            className="absolute top-2 right-2"
            fill="#7C7C7C"
            size={22}
          />
        )}
      </div>

      <div className="px-2 py-5">
        <div className="flex justify-between items-start">
          <p className="text-grey4 mb-2 text-extraSmall font-semibold">
            {category}
            {region && ` > ${region}`}
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

        <div className="mb-5">{hashtags.map((tag) => tag)}</div>

        <p className="text-grey4 line-clamp-3 text-extraSmall font-medium">
          {description}
        </p>

        {userImage && userName && (
          <div className="flex justify-between items-center text-grey4 mt-7">
            <div className="flex items-center gap-1">
              <Image
                src={userImage}
                alt={userName}
                className="rounded-full object-cover"
                width={16}
                height={16}
              />
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
