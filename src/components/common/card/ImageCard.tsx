"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface IImageCardProps {
  thumbnail: string;
  title: string;
  subTitle: string;
  selectionId: number;
}

const ImageCard = ({ thumbnail, title, selectionId, subTitle }: IImageCardProps) => {
  return (
    <Link
      href={`/selection/${selectionId}`}
      className="flex w-[335px] h-[288px] rounded-lg shadow-lg relative border-[0.5px] border-solid border-grey2 overflow-hidden hover:brightness-90"
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 335px) 100vw, 335px"
      />
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <p className="absolute bottom-12 right-5 text-white text-small">{subTitle}</p>
      <p className="absolute bottom-5 right-5 text-white text-extraLarge line-clamp-1 font-semibold">
        {title}
      </p>
    </Link>
  );
};

export default ImageCard;
