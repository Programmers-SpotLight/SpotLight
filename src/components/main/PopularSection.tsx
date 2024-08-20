import React from "react";
import RowCard, { IRowCardProps } from "../common/card/RowCard";
import Link from "next/link";
import { IsearchData } from "@/models/searchResult.model";

interface IPopularSectionProps {
  selections : IRowCardProps[];

}
const PopularSection = ( {selections} : IPopularSectionProps) => {
  return (
    <div className="pl-5 pr-5 relative">
      <h1 className="text-large font-extrabold">요즘 핫한 인기 셀렉션 🔥</h1>
      <div className="flex justify-between">
        <h2 className="text-medium font-medium text-grey3 mt-[10px] mb-[20px]">
          최근 가장 인기가 뜨거운 셀렉션들이에요
        </h2>
        <Link href="/search" className="cursor-pointer text-medium font-medium text-grey3 mt-[10px]">
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
      {selections.map((selection, index) => (
        <RowCard key={selection.selectionId}
        {...selection}
        ranking={index+1}
        ></RowCard>
      ))}
      </div>
    </div>
  );
};

export default PopularSection;
