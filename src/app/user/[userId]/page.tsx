"use client";

import ColCard from "@/components/common/card/ColCard";
import UserInfo from "@/components/user/UserInfo";
import Pagination from "@/components/search/Pagination";
import { Ihashtags } from "@/models/hashtag.model";
import { Ipagination } from "@/models/searchResult.model";
import React from "react";
import PrivateUser from "@/components/user/other-user/PrivateUser";
import { IMinimumUserInfo } from "@/models/user.model";
import { ISelectionDetailInfo } from "@/models/selection.model";

const user: IMinimumUserInfo = {
  id: 1,
  nickname: "김원길",
  image: "/images/selections/샌과치히로.jpg",
  description:
    "반갑습니다! 저는 김원길입니다. 책, 애니메이션, 영화 관련 셀렉션을 작성하고 수집하고 있습니다. 잘 부탁드립니다.",
  isPrivate: false
};

const selectionData: ISelectionDetailInfo[] = [
  {
    id: 86,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    image: "/images/selections/샌과치히로.jpg",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 125,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    image: "/images/selections/샌과치히로.jpg",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 120,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    image: "/images/selections/샌과치히로.jpg",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  }
];

const pagination: Ipagination = {
  currentPage: 1,
  totalElements: 30,
  totalPages: 5,
  limit: 5
};

const UserPage = () => {
  const otherUser = true;

  if (otherUser) {
    return (
      <div className="border border-solid border-grey2 bg-grey0 w-[1024px] mx-auto min-h-[calc(100vh-74px)] flex justify-center items-center">
        {user.isPrivate ? (
          <PrivateUser />
        ) : (
          <div className="mt-20 flex flex-col items-center">
            <UserInfo
              image={user.image}
              nickname={user.nickname}
              description={user.description}
            />

            <p className="font-bold text-extraLarge mt-20 text-center">
              {user.nickname}님의 셀렉션
            </p>

            <div className="grid grid-cols-3 mt-5 gap-5">
              {selectionData.map((item) => (
                <ColCard
                  key={item.id}
                  thumbnail={item.image!}
                  title={item.title}
                  category={item.categoryName}
                  description={item.description}
                  selectionId={item.id}
                  status={item.status}
                  hashtags={item.hashtags as Ihashtags[]}
                />
              ))}
            </div>

            <Pagination pagination={pagination}></Pagination>
          </div>
        )}
      </div>
    );
  } else {
    //mypage
  }
};

export default UserPage;
