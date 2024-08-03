import React from "react";
import RowCard, { IRowCardProps } from "../common/card/RowCard";
import Link from "next/link";

const tempRowCardData: IRowCardProps[] = [ // 임시 카드 UI 데이터
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description: "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 101,
    userName: "이창우",
    userImage:
      "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
  },
  {
    thumbnail: "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "세븐틴 맛집 모음 2024ver",
    category: "맛집",
    description: "세븐틴이 다녀간 맛집들 모아두고 있습니다. 맛집에 대한 자세한 내용은 스팟 상세 설명 참고!",
    selectionId: 102,
    userName: "이창우",
    userImage:
      "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "뉴진스 하니 픽 디저트 맛집",
    category: "Education",
    region: "Online",
    description: "A comprehensive guide to becoming a JavaScript expert.",
    selectionId: 103,
    userName: "이창우",
    userImage:
      "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
  },
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "Culinary Delights of Asia",
    category: "Food",
    region: "Asia",
    description: "A delicious adventure through the diverse cuisines of Asia.",
    selectionId: 104,
    userName: "이창우",
    userImage:
      "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
  }
];

const PopularSection = () => {
  return (
    <div className="pl-5 pr-5 relative">
      <h1 className="text-large font-extrabold">요즘 핫한 인기 셀렉션 🔥</h1>
      <div className="flex justify-between">
        <h2 className="text-medium font-medium text-grey3 mt-[10px] mb-[20px]">
          최근 가장 인기가 뜨거운 셀렉션들이에요
        </h2>
        <Link href="/search" className="cursor-pointer text-medium font-medium text-grey3 mt-[10px]">
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
      {tempRowCardData.map((temp, index) => (
        <RowCard key={temp.selectionId}
        {...temp
        }
        ranking={index+1}
        ></RowCard>
      ))}
      </div>
    </div>
  );
};

export default PopularSection;
