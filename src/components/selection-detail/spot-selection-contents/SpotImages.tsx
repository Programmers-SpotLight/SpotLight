"use client";
import React, { useState } from "react";
import { LiaArrowAltCircleLeft, LiaArrowAltCircleRight } from "react-icons/lia";

interface ISpotImages {
  imgs: string[];
}

const SpotImages = ({ imgs }: ISpotImages) => {
  const [imgIndex, setImgIndex] = useState(0);

  const nextBtnClickHandler = () => {
    if (imgIndex + 1 === imgs.length) setImgIndex(0);
    else setImgIndex((prev) => prev + 1);
  };

  const prevBtnClickHandler = () => {
    if (imgIndex - 1 < 0) setImgIndex(imgs.length - 1);
    else setImgIndex((prev) => prev - 1);
  };
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: "calc(100vh - 74px)" }}
    >
      <button
        className="absolute top-1/2 left-3 transform -translate-y-1/2"
        onClick={nextBtnClickHandler}
      >
        <LiaArrowAltCircleLeft size={50} />
      </button>

      <img src={imgs[imgIndex]} alt="spot image" />

      <button
        className="absolute top-1/2 right-3 transform -translate-y-1/2"
        onClick={prevBtnClickHandler}
      >
        <LiaArrowAltCircleRight size={50} />
      </button>
    </div>
  );
};

export default SpotImages;
