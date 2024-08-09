import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PictureInput from "@/components/common/input/PictureInput";
import { PrevArrow, NextArrow } from "./ReviewImageSlideButton";

interface IReviewModalImage {
  pictures: IReviewImage[];
  onPictureAdd: (image: string) => void;
  onPictureChange: (index: number, newPicture: string) => void;
  onPictureRemove: (index: number) => void;
}

const ReviewModalImage = ({ 
  pictures, 
  onPictureAdd, 
  onPictureChange, 
  onPictureRemove 
}: IReviewModalImage) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    infinite: false,
    speed: 500,
    centerMode: false,
    centerPadding: "0",
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    afterChange: (current: number) => setCurrentSlide(current),
    prevArrow: <PrevArrow show={currentSlide !== 0} onClick={() => {}} />,
    nextArrow: <NextArrow show={currentSlide < pictures.length - 2} onClick={() => {}} />,
  };

  return (
    <div className="slider-container">
      <Slider {...settings} className="w-auto flex justify-start">
        <div className="px-1 inline-block">
          <PictureInput 
            inputSize="small" 
            onPictureChange={onPictureAdd} 
          />
        </div>
        {pictures && pictures.map((pic, index) => (
          <div key={pic.reviewImageOrder} className="px-1 inline-block relative">
            <PictureInput 
              inputSize="small" 
              imgSrc={pic.reviewImgSrc} 
              onPictureChange={(newPicture) => onPictureChange(index, newPicture)} 
              index={index} 
            />
            <div 
              className="absolute top-2 right-2 cursor-pointer text-extraSmall text-white bg-grey4 rounded-full w-4 h-4 flex items-center justify-center hover:bg-grey3"
              onClick={() => onPictureRemove(index)}
            >
              x
            </div>
          </div>
        )).reverse()}
      </Slider>
    </div>
  );
};

export default ReviewModalImage;
