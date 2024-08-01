import React from "react";
import { FaBookmark, FaShareAlt } from "react-icons/fa";

const tempData = {
  temp_title: "슬램덩크 무대 탐방 공유합니다!",
  temp_category: "애니메이션",
  temp_hashtags: [
    "슬램덩크",
    "슬램덩크 무대탐방",
    "당일치기",
    "도쿄",
    "북산고",
    "정대만"
  ],
  temp_img:
    "https://i.namu.wiki/i/O0u4__0DlY6tc9-S505SLruRy-q4ZOJ44-SHzBhGNsHVsUfnx5wE5mOB0XMCY6hloGXzRrfF7WXuu2nmGUNQhA.webp",
  temp_writer_img:
    "https://ilyo.co.kr/contents/article/images/2023/1102/1698901514791536.jpg",
  temp_writer: "이창우"
};

const SelectionHeader = () => {
  return (
    <>
      <img
        src={tempData.temp_img}
        className="w-full h-[218px] object-cover border border-grey2"
        alt="SelectionImg"
      />
      <div className="relative flex flex-col gap-[5px] p-5">
        <div className="flex justify-between ">
          <h2 className="text-small text-grey4 font-medium">
            {tempData.temp_category}
          </h2>
          <p className="flex gap-[5px]">
            <FaShareAlt className="w-5 h-5 fill-grey3 cursor-pointer" />
            <FaBookmark className="w-5 h-5 fill-grey3 cursor-pointer" />
          </p>
        </div>

        <h1 className="text-[20px] text-black font-bold">
          {tempData.temp_title}
        </h1>
        <div className="flex flex-wrap gap-[5px] overflow-auto mt-[5px] mb-[15px]">
          {tempData.temp_hashtags.map((hashtag, index) => (
            <div
              key={index}
              className="p-2 bg-white border border-solid border-grey3 rounded-badge text-extraSmall text-grey3 flex justify-center items-center whitespace-nowrap
                font-medium"
              style={{ flexShrink: 0 }}
            >
              {hashtag}
            </div>
          ))}
        </div>
        <div className="flex gap-[5px] justify-end items-center cursor-pointer">
          <img
            src={tempData.temp_writer_img}
            className="object-cover border-none w-5 h-5 bg-grey1 rounded-full"
          />
          <h3 className="font-medium text-small text-grey4">
            {tempData.temp_writer}
          </h3>
        </div>
        <hr className="mt-5" />
      </div>
    </>
  );
};

export default SelectionHeader;
