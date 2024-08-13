import Button from "@/components/common/button/Button";
import Hashtag from "@/components/common/Hashtag";
import { Ihashtags } from "@/models/hashtag.model";
import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { MdChatBubble } from "react-icons/md";
import { PiCardsFill } from "react-icons/pi";
import { useStore } from "zustand";

const userInfoWidgetDatas = [
  { icons: <PiCardsFill />, count: 3, name: "작성한 셀렉션" },
  { icons: <FaHeart />, count: 4, name: "북마크 셀렉션" },
  { icons: <MdChatBubble />, count: 1, name: "셀렉션 리뷰" },
  { icons: <MdChatBubble />, count: 2, name: "스팟 리뷰" }
];

const hashtags: Ihashtags[] = [
  {
    htag_id: 3,
    htag_name: "해시태그",
    htag_type: "none"
  },
  {
    htag_id: 2,
    htag_name: "해시태그 조금 길게",
    htag_type: "none"
  },
  {
    htag_id: 4,
    htag_name: "이정도 해시태그",
    htag_type: "none"
  },
  {
    htag_id: 5,
    htag_name: "해시태그 살짝 많이 길수도",
    htag_type: "none"
  },
  {
    htag_id: 6,
    htag_name: "해시태그 조금 길게",
    htag_type: "none"
  },
  {
    htag_id: 7,
    htag_name: "이정도 해시태그",
    htag_type: "none"
  },
  {
    htag_id: 8,
    htag_name: "해시태그 살짝 많이 길수도",
    htag_type: "none"
  }
];

const UserInfoWidget = () => {
  const {openModal} = useStore(useModalStore)

  return (
    <div className="mt-10 flex flex-col gap-10">
      <ul className="flex gap-6 justify-center">
        {userInfoWidgetDatas.map((item, index) => (
          <li
            key={index}
            className="flex flex-col gap-[5px] text-grey3 justify-center items-center "
          >
            <div className="text-[20px]">{item.icons}</div>
            <h1 className="font-extrabold text-extraLarge text-grey4">
              {item.count}
            </h1>
            <h2 className="font-semibold text-small text-grey4">{item.name}</h2>
          </li>
        ))}
      </ul>
      <ul className="w-[600px] flex gap-[5px] flex-wrap justify-center">
        {hashtags.map((hashtag, index) => (
          <li key={hashtag.htag_id}>
            <Hashtag size="big" name={hashtag.htag_name} />
          </li>
        ))}
        <button 
        className="w-[26px] h-[26px] bg-grey3 rounded-full flex justify-center items-center transition-transform transform hover:scale-110"
        onClick={() => openModal("editTag", {hashtags: hashtags})}
        >
          <IoIosAdd className="fill-white text-large" />
        </button>
      </ul>
    </div>
  );
};

export default UserInfoWidget;
