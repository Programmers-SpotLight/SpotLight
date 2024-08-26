"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { NextArrow, PrevArrow } from "./RecommendationSection";
import Slider from "react-slick";
import ColCard, { IColCardProps } from "../common/card/ColCard";
import axios from "axios";
import { getRecommendationSelections } from "@/http/selectionMain.api";

const tempData: IColCardProps[] = [
  // 임시 카드 UI 데이터
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 1,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    status: "public",
    hashtags : [{htag_id : 1, htag_name : "반갑다", htag_type: "none"}]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 2,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    status: "public",
    hashtags : [{htag_id : 1, htag_name : "반갑다", htag_type: "none"}]
  },
];

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />
};

const InterestingSection = () => {

  useEffect(()=>{
    getRecommendationSelections();
  }, [])
  
  return (
    <div className="pl-5 pr-5 relative mb-10">
      <h1 className="text-large font-extrabold">
        혹시 이런 셀렉션은 어떠세요? 👀
      </h1>
      <div className="flex justify-between">
        <h2 className="text-medium font-medium text-grey3 mt-[10px] mb-[20px]">
          사용자님이 관심이 있을만한 셀렉션으로 구성해봤어요
        </h2>
        <Link href="/search" className="cursor-pointer text-medium font-medium text-grey3 mt-[10px]">
          전체보기
        </Link>
      </div>
      <Slider {...settings}>
        {tempData.map((data) => (
          <ColCard key={data.selectionId} {...data} />
        ))}
      </Slider>
    </div>
  );
};

export default InterestingSection;
