import Link from "next/link";
import React, { ReactNode } from "react";

type TBannerPosition = "left" | "center" | "right";

interface BannerProps {
  img: string;
  title: string;
  subTitle: string;
  categoryId? : number;
  notOpacity? : boolean;
  button?: ReactNode;
  position?: TBannerPosition;
}

const Banner = ({ img, title, subTitle, button, notOpacity, categoryId}: BannerProps) => {
  return (
    <div
      className="relative w-full h-[285px] flex flex-col rounded-lg"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!notOpacity && <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-10 leading-9">
        <h2 className="text-extraLarge font-light">{subTitle}</h2>
        <h1 className="text-[32px] font-bold">{title}</h1>
        {button ? (
          <Link href={'/selection/create'} className="mt-4">{button}</Link>
        ) : (
          <Link href={`/search?category_id=${categoryId}`} className="font-light underline underline-offset-1 mt-[10px] cursor-pointer">
            바로 확인하러 가기
          </Link>
        )}
      </div>
    </div>
  );
};

export default Banner;
