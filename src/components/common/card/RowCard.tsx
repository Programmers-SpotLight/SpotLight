"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineThumbUp, MdThumbUp } from "react-icons/md";
import { IBaseCardProps } from "./ColCard";

export interface IRowCardProps extends IBaseCardProps {
  userName: string;
  userImage: string;
  likes?: number;
  liked?: boolean;
  ranking?: number;
}

const RowCard = ({
  thumbnail,
  title,
  category,
  region,
  description,
  userName,
  userImage,
  ranking,
  likes,
  liked,
  selectionId
}: IRowCardProps) => {
  return (
    <Link
      href={`/selection/${selectionId}`}
      className="flex w-[512px] h-[150px] rounded-lg relative border-[0.5px] border-solid border-grey2 hover:brightness-75 bg-white"
    >
      <Image
        src={thumbnail}
        priority
        width={242}
        height={150}
        alt="title"
        className="rounded-bl-lg rounded-tl-lg object-cover"
      />
      <div className="absolute w-[30px] h-[23px] bg-black rounded-tl-lg top-0 left-0 text-white flex items-center justify-center text-small font-bold">
        {ranking}
      </div>

      <div className="w-[270px] py-5 px-5">
        <p className="font-bold mb-1 text-medium line-clamp-1">{title}</p>
        <p className="text-grey4 mb-4 text-extraSmall font-semibold">
          {category}
          {region && ` > ${region}`}
        </p>

        <p className="text-grey4 line-clamp-2 text-extraSmall font-medium">
          {description}
        </p>

        <div className="flex justify-between items-center text-grey4 mt-5">
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
      </div>
    </Link>
  );
};

export default RowCard;
