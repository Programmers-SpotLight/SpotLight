import React, { ReactNode } from "react";

interface BannerProps {
  img: string;
  title: string;
  subTitle: string;
  button?: ReactNode;
}

const Banner = ({ img, title, subTitle, button }: BannerProps) => {
  return (
    <div className="relative w-full h-full">
      <img src={img} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-10 leading-9">
        <h2 className="text-extraLarge font-light">{subTitle}</h2>
        <h1 className="text-[32px] font-bold">{title}</h1>
        {button ? <div className="mt-4">{button}</div>
        : <h3 className="font-light underline underline-offset-1 mt-[10px] cursor-pointer">바로 확인하러 가기</h3> 
        }
      </div>
    </div>
  );
};

export default Banner;
