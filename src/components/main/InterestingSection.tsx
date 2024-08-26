'use client';

import Link from "next/link";
import React from "react";
import { NextArrow, PrevArrow } from "./RecommendationSection";
import Slider from "react-slick";
import ColCard from "../common/card/ColCard";
import useFetchRecommendationSelection from "@/hooks/queries/useFetchRecommendationSelection";

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />
};

const InterestingSection = () => {
  const{data : recommendations, isLoading, isError} = useFetchRecommendationSelection();

  if(!recommendations) return null;

  return (
    <div className="pl-5 pr-5 relative mb-10">
      <h1 className="text-large font-extrabold">
        혹시 이런 셀렉션은 어떠세요? 👀
      </h1>
      <div className="flex justify-between">
        <h2 className="text-medium font-medium text-grey3 mt-[10px] mb-[20px]">
          사용자님이 관심이 있을만한 셀렉션으로 구성해봤어요
        </h2>
      </div>
      <Slider {...settings}>
        {recommendations.map((data) => (
          <ColCard key={data.selectionId} {...data} />
        ))}
      </Slider>
    </div>
  );
};

export default InterestingSection;
