"use client";
import { ISpotImage } from "@/models/spot.model";
import Image from "next/image";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

interface ISpotImagesProps {
  images: ISpotImage[];
  title: string;
}

const SpotImages = ({ images, title }: ISpotImagesProps) => {
  const [imgIndex, setImgIndex] = useState(0);

  const nextBtnClickHandler = () => {
    if (imgIndex + 1 === images.length) setImgIndex(0);
    else setImgIndex((prev) => prev + 1);
  };

  const prevBtnClickHandler = () => {
    if (imgIndex - 1 < 0) setImgIndex(images.length - 1);
    else setImgIndex((prev) => prev - 1);
  };
  return (
    <div className="relative flex items-center justify-center h-[100vh]">
      <button
        className="absolute top-1/2 left-10 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
        onClick={prevBtnClickHandler}
      >
        <IoIosArrowBack size={50} fill="white" />
      </button>
      <p className="text-white absolute top-10 text-extraLarge">{title}</p>

      <p className="text-white absolute top-10 left-10 text-extraLarge">
        {imgIndex + 1}/{images.length}
      </p>
      <div className="w-screen h-screen relative">
        <Image
          src={images[imgIndex].url}
          alt="spot image"
          fill
          className="object-scale-down"
        />
      </div>

      <button
        className="absolute top-1/2 right-10 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
        onClick={nextBtnClickHandler}
      >
        <IoIosArrowBack size={50} fill="white" className="rotate-180" />
      </button>
    </div>
  );
};

export default SpotImages;
