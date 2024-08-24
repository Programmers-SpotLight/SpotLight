import Hashtag from "@/components/common/Hashtag";
import { useUserPage } from "@/context/UserPageContext";
import { Ihashtags } from "@/models/hashtag.model";
import { IUserInfoMapping } from "@/models/user.model";
import { useModalStore } from "@/stores/modalStore";
import Image from "next/image";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdChatBubble } from "react-icons/md";
import { PiCardsFill } from "react-icons/pi";
import { useStore } from "zustand";
import UserProfileImage from "./UserProfileImage";

interface UserInfoWidgetProps extends IUserInfoMapping {
  userId: string;
  hashtags : Ihashtags[];
}

const UserInfoWidget = ({
  image,
  nickname,
  description,
  hashtags,
  selection_count,
  bookmark_count,
  spot_review_count,
  selection_review_count,
  userId
}: UserInfoWidgetProps) => {
  const userInfoWidgetDatas = [
    {
      icons: <PiCardsFill />,
      count: selection_count,
      name: "작성한 셀렉션",
      type: "public"
    },
    {
      icons: <FaHeart />,
      count: bookmark_count,
      name: "북마크 셀렉션",
      type: "public"
    },
    {
      icons: <MdChatBubble />,
      count: selection_review_count,
      name: "셀렉션 리뷰",
      type: "private"
    },
    {
      icons: <MdChatBubble />,
      count: spot_review_count,
      name: "스팟 리뷰",
      type: "private"
    }
  ];
  const { openModal } = useStore(useModalStore);
  const { isMyPage } = useUserPage();

  const filteredWidgetData = isMyPage
    ? userInfoWidgetDatas
    : userInfoWidgetDatas.filter((item) => item.type === "public");
  

  return (
    <div className="w-[1024px] m-auto flex flex-col justify-center items-center mb-10">
      <div className="flex w-[380px] gap-5 justify-center mt-10">
        <UserProfileImage image={image} userId={userId} nickname={nickname} isMypage={isMyPage}/>
        <div className="flex flex-col items-start justify-end gap-2">
          <span className="font-extrabold text-large">{nickname}님</span>
          <div className="flex w-[250px] items-center text-grey4 break-keep relative text-small">
            {description ? description : "자기소개가 없습니다."}
            {isMyPage && (
              <IoPencil
                className="text-medium cursor-pointer ml-[5px]"
                onClick={() => openModal("editInfo", { description, userId })}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-10">
        <ul className="flex gap-6 justify-center">
          {filteredWidgetData.map((item, index) => (
            <li
              key={index}
              className="flex flex-col gap-[5px] text-grey3 justify-center items-center"
            >
              <div className="text-[20px]">{item.icons}</div>
              <h1 className="font-extrabold text-extraLarge text-grey4">
                {item.count}
              </h1>
              <h2 className="font-semibold text-small text-grey4">
                {item.name}
              </h2>
            </li>
          ))}
        </ul>

        {isMyPage && (
          <ul className="w-[600px] h-[50px] flex gap-[5px] flex-wrap justify-center items-center">
            {hashtags.length === 0 ? (
              <div className="flex justify-start items-center text-small text-grey3">
                관심있는 해시태그를 추가하세요!
              </div>
            ) : (
              <>
                {hashtags.map((hashtag) => (
                  <li key={hashtag.user_htag_id}>
                    <Hashtag size="big" name={hashtag.htag_name} />
                  </li>
                ))}
              </>
            )}
            <button
              className="w-[26px] h-[26px] bg-grey3 rounded-full flex justify-center items-center transition-transform transform hover:scale-110"
              onClick={() => openModal("editTag", { userId })}
            >
              <IoIosAdd className="fill-white text-large" />
            </button>
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserInfoWidget;
