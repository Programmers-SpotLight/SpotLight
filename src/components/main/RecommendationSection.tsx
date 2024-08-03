"use client";

import React from "react";
import ImageCard, { IImageCardProps } from "../common/card/ImageCard";
import Slider from "react-slick";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <GrFormPrevious
      className="absolute top-1/2 left-[-30px] transform -translate-y-1/2 w-7 h-7 bg-grey3 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-grey-700 hover:scale-110 transition-transform duration-200"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

export const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <GrFormNext
      className="absolute top-1/2 right-[-30px] transform -translate-y-1/2 w-7 h-7 bg-grey3 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-grey-700 hover:scale-110 transition-transform duration-200"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

const tempData: IImageCardProps[] = [
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "너의 이름은 무대 탐방 셀렉션",
    subTitle: "애니메이션 좋아한다면 필수!",
    selectionId: 1
  },
  {
    thumbnail:
      "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "BTS 정국 맛집 탐방 셀렉션",
    subTitle: "ARMY라면 죽기 전에 꼭 가봐야 할",
    selectionId: 2
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "선재 업고 튀어 무대 탐방 셀렉션",
    subTitle: "드라마 속 두근 거림을 또 한번 느끼는",
    selectionId: 3
  }
];

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />
};

const RecommendationSection = () => {
  return (
    <div className="pl-5 pr-5 relative">
      <h1 className="text-large font-extrabold">
        Spotlight가 추천하는 이색 셀렉션 ✨
      </h1>
      <h2 className="text-medium font-medium text-grey3 mt-[10px] mb-[20px]">
        Spotlight 큐레이터 선정 베스트 셀렉션!
      </h2>
      <Slider {...settings}>
        {tempData.map((data) => (
          <ImageCard key={data.selectionId} {...data} />
        ))}
      </Slider>
    </div>
  );
};

export default RecommendationSection;
