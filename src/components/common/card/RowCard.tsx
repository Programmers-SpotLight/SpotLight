"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineThumbUp, MdThumbUp } from "react-icons/md";
import { IBaseCardProps } from "./ColCard";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useBookMarks } from "@/hooks/queries/useBookMarks";
import { useSession } from "next-auth/react";

export interface IRowCardProps extends IBaseCardProps {
  userName: string;
  userImage: string;
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
  selectionId
}: IRowCardProps) => {
  const { data } = useSession();
  const { isBookmarked, addBookMarksMutate, removeBookMarksMutate } =
    useBookMarks(selectionId, data?.user.id);
  const handleBookMarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isBookmarked ? removeBookMarksMutate() : addBookMarksMutate();
  };

  return (
    <Link
      href={`/selection/${selectionId}`}
      className="flex w-[512px] h-[150px] rounded-lg relative border-[0.5px] border-solid border-grey2 hover:brightness-75 bg-white"
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          priority
          width={242}
          height={150}
          alt="title"
          className="rounded-bl-lg rounded-tl-lg object-cover"
        />
      ) : (
        <div className="w-[242px] h-full flex justify-center items-center text-white font-bold text-large bg-grey2">
          spotlight
        </div>
      )}

      <div className="absolute w-[30px] h-[23px] bg-black rounded-tl-lg top-0 left-0 text-white flex items-center justify-center text-small font-bold">
        {ranking}
      </div>

      <div className="absolute top-2 right-2">
        {isBookmarked ? (
          <FaBookmark
            className="w-5 h-5 fill-red-600 cursor-pointer"
            onClick={handleBookMarkClick}
          />
        ) : (
          <FaRegBookmark
            className="w-5 h-5 fill-grey3 cursor-pointer"
            onClick={handleBookMarkClick}
          />
        )}
      </div>

      <div className="w-[270px] py-5 px-5">
        <p className="font-bold mb-2 text-medium line-clamp-1">{title}</p>
        <p className="text-grey4 mb-4 text-extraSmall font-semibold">
          {category}
          {region && ` > ${region}`}
        </p>

        <p className="text-grey4 line-clamp-2 text-extraSmall font-medium h-6 mb-6">
          {description}
        </p>

        {userImage && userName && (
          <div className="flex justify-between items-center text-grey4 mt-auto">
            <div className="flex items-center gap-1">
              <div className="relative w-[16px] h-[16px]">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    className="rounded-full object-cover"
                    fill
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center font-bold text-large" />
                )}
              </div>
              <span className="text-extraSmall font-semibold">{userName}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RowCard;
