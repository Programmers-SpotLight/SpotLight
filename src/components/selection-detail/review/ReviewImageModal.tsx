import { useModalStore } from "@/stores/modalStore";
import React, { useEffect, useState } from "react";
import { useStore } from "zustand";
import { TmodalType } from "@/models/modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PrevArrow = (props: any) => {
  const { onClick, show } = props;
  if (!show) return null;
  return (
    <IoIosArrowBack
      size={60}
      className="absolute -left-[100px] top-1/2 transform -translate-y-1/2 text-white flex items-center justify-center cursor-pointer"
      onClick={onClick}
    />
  );
};

const NextArrow = (props: any) => {
  const { onClick, show } = props;
  if (!show) return null;
  return (
    <IoIosArrowForward
      size={60}
      className="absolute -right-[100px] top-1/2 transform -translate-y-1/2 text-white flex items-center justify-center cursor-pointer"
      onClick={onClick}
    />
  );
};

interface IImageModalProps {
  images: string[];
  currentIndex: number;
}

interface ImodalDatas {
  type: TmodalType;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "image"
  }
];

const ReviewImageModal = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);
  const { images, currentIndex } = (props as IImageModalProps) || { images: [], currentIndex: 0 };
  const [currentSlide, setCurrentSlide] = useState(currentIndex);

  useEffect(() => {
    setCurrentSlide(currentIndex);
  }, [currentIndex]);

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    closeModal();
  };

  const settings = {
    className: "",
    adaptiveHeight: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentIndex,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    afterChange: (current: number) => setCurrentSlide(current),
    prevArrow: <PrevArrow show={currentSlide !== 0} />,
    nextArrow: <NextArrow show={currentSlide < images.length - 1} />
  };


  return (
    <div
      className="w-screen h-screen flex justify-center items-center fixed inset-0 bg-black  z-20"
      onClick={handleOverlayClick}
    >
      <div className="absolute top-[20px] text-extraLarge text-white bg-black bg-opacity-50 rounded-br-lg">{currentSlide + 1}/{images.length}</div>
      <div className="absolute top-[20px] right-[20px] text-extraLarge text-white cursor-pointer" onClick={closeModal}>X</div>
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="slider-container relative w-[50vh] h-full">
          <Slider {...settings}>
            {images.map((url, index) => (
              <div key={index} className="flex items-center justify-center w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ReviewImageModal;