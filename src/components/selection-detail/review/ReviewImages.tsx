import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useModalStore } from "@/stores/modalStore";

const PrevArrow = (props: any) => {
  const { onClick, show } = props;
  if (!show) return null;
  return (
    <IoIosArrowBack
      className="w-[20px] h-[20px] absolute top-1/2 -left-[7px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

const NextArrow = (props: any) => {
  const { onClick, show } = props;
  if (!show) return null;
  return (
    <IoIosArrowForward
      className="w-[20px] h-[20px] absolute top-1/2 -right-[7px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

interface IReveiewImage {
  images: string[];
}

const ReviewImages = ({ images }: IReveiewImage) => {
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
    prevArrow: <PrevArrow show={currentSlide !== 0} />,
    nextArrow: <NextArrow show={currentSlide < images.length - 2} />
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
              src={images[0]}
              alt={"Image 1"}
              className={"w-[160px] h-[160px] object-cover rounded-lg"}
            />
          </div>
          :
          <Slider {...settings}> 
            {images.map((url, index) => (
              <div key={index} className="px-1 cursor-pointer" onClick={() => openReviewImageModal(index)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
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