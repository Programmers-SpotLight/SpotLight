"use client";
import Spinner from "@/components/common/Spinner";
import { ISpotImage } from "@/models/spot.model";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";

interface ISpotImagesProps {
  images: ISpotImage[];
  title: string;
}

const SpotImages = ({ images, title }: ISpotImagesProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [imgIndex]);

  const nextBtnClickHandler = () => {
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevBtnClickHandler = () => {
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative flex items-center justify-center h-[100vh]">
      <p className="text-white absolute top-10 text-extraLarge">{title}</p>

      <p className="text-white absolute top-10 left-10 text-extraLarge">
        {imgIndex + 1}/{images.length}
      </p>

      <div className="w-screen h-screen relative">
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner size="large" />
          </div>
        )}
        <Image
          src={images[imgIndex].url}
          alt="spot image"
          fill
          className="object-scale-down"
          onLoadingComplete={() => setIsLoading(false)}
          style={{ visibility: isLoading ? "hidden" : "visible" }}
          unoptimized
        />
      </div>

      <button
        className="absolute top-1/2 left-10 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
        onClick={prevBtnClickHandler}
      >
        <IoIosArrowBack size={50} fill="white" />
      </button>

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
