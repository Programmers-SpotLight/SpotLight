import React, { useState } from "react";
import PictureInput from "@/components/common/input/PictureInput";
import { NextArrow, PrevArrow } from "./ReviewImageSlideButton";

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
  onPictureRemove,
}: IReviewModalImage) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isDisabled = pictures.length >= 8;
  const sliderWidth = 159; 
  const visibleSlides = 3; 
  const totalSlides = pictures.length + 1; // +1은 PictureInput 추가를 위한 공간

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSlides - visibleSlides) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" style={{ width: `${sliderWidth * visibleSlides}px` }}>
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * sliderWidth}px)` }}
        >
          <div
            className={`${isDisabled ? "pointer-events-none opacity-50" : ""}`}
            style={{ width: `${sliderWidth}px`, flexShrink: 0 }}
          >
            <PictureInput inputSize="small" onPictureChange={onPictureAdd} />
          </div>

          {pictures.map((pic, index) => (
            <div key={pic.reviewImageOrder} className="relative" style={{ width: `${sliderWidth}px`, flexShrink: 0 }}>
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
        </div>
      </div>
      <PrevArrow
        onClick={handlePrev}
        show={currentIndex > 0}
        style={{ left: -10, top: "50%", transform: "translateY(-50%)" }}
      />
      <NextArrow
        onClick={handleNext}
        show={currentIndex < totalSlides - visibleSlides}
        style={{ right: -5, top: "50%", transform: "translateY(-50%)" }}
      />
    </div>
  );
};

export default ReviewModalImage;

