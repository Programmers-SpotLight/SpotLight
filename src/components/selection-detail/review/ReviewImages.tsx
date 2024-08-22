import Slider from "react-slick";
import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useModalStore } from "@/stores/modalStore";
import { PrevArrow, NextArrow } from "./ReviewImageSlideButton";

interface IReveiewImageProps {
  images: IReviewImage[];
}

const ReviewImages = ({ images }: IReveiewImageProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { openModal } = useModalStore();

  const settings = {
    infinite: false,
    speed: 500,
    centerMode: false,
    centerPadding: "0",
    slidesToShow: 2,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    afterChange: (current: number) => setCurrentSlide(current),
    prevArrow: <PrevArrow show={currentSlide !== 0} onClick={() => {}} />,
    nextArrow: <NextArrow show={currentSlide < images.length - 2} onClick={() => {}} />,
  };

  const openReviewImageModal = (index: number) => {
    openModal("image", {
      images,
      currentIndex: index
    });
  };

  return (
    <div className="slider-container relative w-full h-[160px]">
      
        { images.length === 1 
          ? 
          <div className="px-1 cursor-pointer" onClick={() => openReviewImageModal(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0].reviewImgSrc}
              alt={"Image 1"}
              className={"w-[160px] h-[160px] object-cover rounded-lg"}
            />
          </div>
          :
          <Slider {...settings}> 
            {images.map((img, index) => (
              <div key={index} className="px-1 cursor-pointer" onClick={() => openReviewImageModal(index)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.reviewImgSrc}
                  alt={`Image ${index + 1}`}
                  className={`w-[160px] h-[160px] object-cover 
                  ${
                    index === 0 
                    ? "rounded-tl-lg rounded-bl-lg" 
                    : index === images.length - 1 
                      ? "rounded-tr-lg rounded-br-lg" 
                      : ""
                  }`}
                />
              </div>
            ))}
          </Slider>
        }  
    </div>
  );
};

export default ReviewImages;