import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoMdLock } from "react-icons/io";
import { TselectionStatus } from "@/models/searchResult.model";
import { Ihashtags } from "@/models/hashtag.model";
import Hashtag from "../Hashtag";
import { BiSolidPencil } from "react-icons/bi";
import { FaBookmark, FaRegBookmark, FaTrash } from "react-icons/fa";
import useHandleCardMenu from "@/hooks/useHandleCardMenu";
import { useSession } from "next-auth/react";
import { useBookMarks } from "@/hooks/queries/useBookMarks";
import { TuserSelection } from "@/models/user.model";

export interface IBaseCardProps {
  thumbnail: string;
  title: string;
  category: string;
  region?: string;
  description: string;
  selectionId: number;
}

export interface IColCardProps extends IBaseCardProps {
  userName?: string;
  userImage?: string;
  hashtags: Ihashtags[];
  status: TselectionStatus;
  isMyPage?: boolean;
  booked?: boolean;
  userSelectionType?: TuserSelection;
  onClick?: () => void;
}

const menuList = [
  {
    title: "수정하기",
    icon: <BiSolidPencil />
  },
  {
    title: "비공개 설정하기",
    icon: <IoMdLock />
  },
  {
    title: "삭제하기",
    icon: <FaTrash />
  }
];

const ColCard = ({
  thumbnail,
  title,
  category,
  region,
  description,
  userName,
  userImage,
  hashtags,
  selectionId,
  isMyPage,
  status = "public",
  booked = false,
  userSelectionType
}: IColCardProps) => {
  const { data } = useSession();
  const { addBookMarksMutate, removeBookMarksMutate } = useBookMarks(
    selectionId,
    data?.user.id
  );

  const {
    showMenu,
    selectionMenuRef,
    currentStatus,
    handleIconClick,
    handleMenuItemClick
  } = useHandleCardMenu(status, data?.user.id);

  const handleBookMarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    booked ? removeBookMarksMutate() : addBookMarksMutate();
  };
  return (
    <Link
      href={`/selection/${selectionId}`}
      className={`flex flex-col w-[248px] ${
        userImage && userName ? "h-[389px]" : "h-[389px]"
      } rounded-lg border-[0.5px] border-solid border-grey2 hover:brightness-95 transition-transform duration-200 bg-white`}
    >
      <div className="relative w-full h-[178px]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority
            className="rounded-t-lg object-cover z-0"
            sizes="width : 100%, height : 178px"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white font-bold text-large bg-grey2">
            spotlight
          </div>
        )}

        {currentStatus === "private" && (
          <IoMdLock
            className="absolute top-2 right-2"
            fill="#7C7C7C"
            size={22}
          />
        )}
      </div>

      <div className="px-2 py-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <p className="text-grey4 mb-2 text-extraSmall font-semibold">
            {category}
            {region && ` / ${region}`}
          </p>
          {isMyPage && userSelectionType === "my" && (
            <div className="relative">
              <GoKebabHorizontal
                fill="#7C7C7C"
                className="rotate-90 z-10"
                size={12}
                onClick={handleIconClick}
              />
              {showMenu && (
                <ul
                  className="absolute top-5 right-30 bg-white border border-grey2 shadow-md w-[206px] flex border-solid rounded-lg flex-col z-10"
                  ref={selectionMenuRef}
                >
                  {menuList.map((menu, index) => (
                    <li
                      className={`cursor-pointer border-b border-solid border-grey2 hover:bg-grey1 flex gap-[10px] items-center text-grey4 px-5 box-border py-[5px] ${
                        menu.title === "삭제하기" ? "text-red-500" : ""
                      }`}
                      key={menu.title}
                      onClick={(e) =>
                        handleMenuItemClick(e, menu.title, selectionId, title)
                      }
                    >
                      {menu.icon}
                      <h1 className="font-medium my-[10px]">{menu.title}</h1>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <p className="font-bold mb-3 text-medium line-clamp-1">{title}</p>

        <div className="mb-5 flex overflow-hidden">
          {hashtags.map((tag) => (
            <li className="list-none" key={tag.htag_id}>
              <Hashtag name={tag.htag_name} size="small" />
            </li>
          ))}
        </div>

        <p className="text-grey4 line-clamp-3 text-extraSmall font-medium h-9">
          {description}
        </p>

        {userName && (
          <div className="flex justify-between items-center text-grey4 mt-auto">
            <div className="flex items-center gap-1">
              <div className="relative w-[16px] h-[16px]">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    className="rounded-full object-cover"
                    fill
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center font-bold text-large bg-grey2 rounded-full" />
                )}
              </div>
              <span className="text-extraSmall font-semibold">{userName}</span>
            </div>

            <div>
              {booked ? (
                <FaBookmark
                  className="w-5 h-5 fill-red-600 cursor-pointer"
                  onClick={handleBookMarkClick}
                />
              ) : (
                <FaRegBookmark
                  className="w-5 h-5 fill-grey3 cursor-pointer"
                  onClick={handleBookMarkClick}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ColCard;
