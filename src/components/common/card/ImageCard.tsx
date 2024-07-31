"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
interface IImageCardProps {
  thumbnail: string;
  title: string;
  selectionId: number;
}

const ImageCard = ({ thumbnail, title, selectionId }: IImageCardProps) => {
  return (
    <Link
      href={`/selection/${selectionId}`}
      className="flex w-[335px] h-[288px] rounded-lg shadow-lg relative border-[0.5px] border-solid border-grey2 hover:brightness-75"
    >
      <Image
        src={thumbnail}
        alt="title"
        fill
        className="rounded-lg object-cover"
        sizes="width:100%, height:100%"
      />
      <p className="absolute bottom-5 right-5 text-white text-large line-clamp-1">
        {title}
      </p>
    </Link>
  );
};

export default ImageCard;
