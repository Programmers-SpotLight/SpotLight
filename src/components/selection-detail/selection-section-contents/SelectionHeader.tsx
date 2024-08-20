import Hashtag from "@/components/common/Hashtag";
import { useBookMarks } from "@/hooks/queries/useBookMarks";
import { ISelectionInfo } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBookmark, FaRegBookmark, FaShareAlt } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { toast } from "react-toastify";

interface SelectionHeaderProps {
  selectionData: ISelectionInfo;
}

const SelectionHeader = ({ selectionData }: SelectionHeaderProps) => {
  const { data } = useSession();
  const { addBookMarksMutate, removeBookMarksMutate } = useBookMarks(
    selectionData.id,
    data?.user.id
  );
  const { openModal } = useModalStore();

  const shareClickHandler = () => {
    // 클립보드 핸들러
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("URL이 클립보드에 복사되었습니다!");
      })
      .catch((err) => {
        toast.error("url을 클립보드에 복사하는데 실패했습니다.");
      });
  };

  const bookMarkClickHandler = () => {
    //로그인이 안되어 있다면
    if (!data?.user) {
      openModal("signin");
    }
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
              {selectionData.writer.user_img ? (
                <div className="border-none w-5 h-5 bg-grey1 rounded-full relative">
                  <Image
                    src={selectionData.writer.user_img}
                    alt="userImg"
                    fill
                  />
                </div>
              ) : (
                <div className="border-none w-5 h-5 bg-grey1 rounded-full flex items-center justify-center">
                  <IoPersonSharp fill="white" />
                </div>
              )}

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
