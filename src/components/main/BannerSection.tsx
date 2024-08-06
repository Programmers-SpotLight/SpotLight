"use client";

import React from "react";
import Banner from "../common/Banner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CATEGORY_ID } from "@/constants/id";

const BannerData = [ // CONST로 분리
  {
    img: "/imgs/mainBanner-theater.jpg",
    title: "영화 배경 셀렉션 추천",
    subTitle: "스크린에서만 보던 그 장소가 내 눈앞에!",
    categoryId : CATEGORY_ID.MOVIE
  },
  {
    img: "/imgs/mainBanner-idol.jpg",
    title: "아이돌 맛집 셀렉션 추천",
    subTitle: "최애가 느꼈던 그 기쁨 그대로!",
    categoryId : CATEGORY_ID.IDOL
  },
];

const BannerSection = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
    };
  return (
    <div className="rounded-lg overflow-hidden">
      <Slider {...settings}>
        {BannerData.map((data, index) => (
          <Banner key={index} {...data} />
        ))}
      </Slider>
    </div>
  );
};

export default BannerSection;
