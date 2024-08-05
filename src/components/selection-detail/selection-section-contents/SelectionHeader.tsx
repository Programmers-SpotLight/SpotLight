import Hashtag from "@/components/common/Hashtag";
import { ISelectionDetail } from "@/models/selection";
import React from "react";
import { FaBookmark, FaShareAlt } from "react-icons/fa";

interface SelectionHeaderProps {
  selectionDetailData: ISelectionDetail;
}

const SelectionHeader = ({ selectionDetailData }: SelectionHeaderProps) => {
  const shareClickHandler = () => {
    // 클립보드 핸들러
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다!");
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
      });
  };

  const bookMarkClickHandler = () => {}; // 북마크 핸들러

  return (
    <>
      <img
        src={selectionDetailData.image}
        className="w-full h-[218px] object-cover border border-grey2"
        alt="SelectionImg"
      />
      <div className="relative flex flex-col gap-[5px] p-5">
        <div className="flex justify-between ">
          <h2 className="text-small text-grey4 font-medium">
            {selectionDetailData.category.name}
          </h2>
          <p className="flex gap-[5px]">
            <FaShareAlt
              className="w-5 h-5 fill-grey3 cursor-pointer"
              onClick={shareClickHandler}
            />
            <FaBookmark
              className="w-5 h-5 fill-grey3 cursor-pointer"
              onClick={bookMarkClickHandler}
            />
          </p>
        </div>

        <h1 className="text-[20px] text-black font-bold">
          {selectionDetailData.title}
        </h1>
        <div className="flex flex-wrap gap-[5px] overflow-auto mt-4 mb-[15px]">
          {selectionDetailData.hashtag.map((tag, index) => (
            <Hashtag size="big" name={tag} key={tag} />
          ))}
        </div>
        <div className="flex gap-[5px] justify-end items-center cursor-pointer">
          <img
            src={selectionDetailData.user.image}
            className="object-cover border-none w-5 h-5 bg-grey1 rounded-full"
            alt="userImg"
          />
          <h3 className="font-medium text-small text-grey4">
            {selectionDetailData.user.nickname}
          </h3>
        </div>
        <hr className="mt-5" />
      </div>
    </>
  );
};

export default SelectionHeader;
