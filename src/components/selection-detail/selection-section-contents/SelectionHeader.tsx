import Hashtag from "@/components/common/Hashtag";
import { useBookMarks } from "@/hooks/queries/useBookMarks";
import { ISelectionInfo } from "@/models/selection.model";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBookmark, FaRegBookmark, FaShareAlt } from "react-icons/fa";

interface SelectionHeaderProps {
  selectionData: ISelectionInfo;
}

const SelectionHeader = ({ selectionData }: SelectionHeaderProps) => {
  const { addBookMarksMutate, removeBookMarksMutate } = useBookMarks(
    selectionData.id,
    1
  );
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

  const bookMarkClickHandler = () => {
    //북마크 추가 삭제
    if (selectionData.booked) {
      removeBookMarksMutate();
    } else {
      addBookMarksMutate();
    }
  };

  return (
    <>
      <div className="w-full h-[218px] border border-grey2 relative">
        {selectionData.image ? (
          <Image src={`/${selectionData.image}`} alt="SelectionImg" fill />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white font-bold text-large bg-grey2">
            spotlight
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-[5px] p-5">
        <div className="flex justify-between ">
          <h2 className="text-small text-grey4 font-medium">
            {selectionData.categoryName} &gt; {selectionData.location}
          </h2>
          <p className="flex gap-[5px]">
            <FaShareAlt
              className="w-5 h-5 fill-grey3 cursor-pointer"
              onClick={shareClickHandler}
            />
            {selectionData.booked ? (
              <FaBookmark
                className="w-5 h-5 fill-red-600 cursor-pointer"
                onClick={bookMarkClickHandler}
              />
            ) : (
              <FaRegBookmark
                className="w-5 h-5 fill-grey3 cursor-pointer"
                onClick={bookMarkClickHandler}
              />
            )}
          </p>
        </div>

        <h1 className="text-[20px] text-black font-bold">
          {selectionData.title}
        </h1>
        <div className="flex flex-wrap gap-[5px] overflow-auto mt-4 mb-[15px]">
          {selectionData.hashtags.map((tag, index) => (
            <Link href={`/search?tags=${tag.htag_name}`} key={tag.htag_name}>
              <Hashtag size="big" name={tag.htag_name} />
            </Link>
          ))}
        </div>

        {selectionData.writer && (
          <Link href={`/user/${selectionData.writerId}`}>
            <div className="flex gap-[5px] justify-start items-center cursor-pointer">
              <img
                src={selectionData.writer.user_img}
                className="object-cover border-none w-5 h-5 bg-grey1 rounded-full"
                alt="userImg"
              />

              <h3 className="font-medium text-small text-grey4">
                {selectionData.writer.user_nickname}
              </h3>
            </div>
          </Link>
        )}

        <hr className="mt-5" />
      </div>
    </>
  );
};

export default SelectionHeader;
