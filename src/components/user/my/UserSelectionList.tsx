import ColCard from "@/components/common/card/ColCard";
import Pagination from "@/components/search/Pagination";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { Ihashtags } from "@/models/hashtag.model";
import { Ipagination } from "@/models/searchResult.model";
import { ISelectionDetailInfo } from "@/models/selection.model";
import { TuserSelection } from "@/models/user.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import React, { useState } from "react";

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
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 1,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 2,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 3,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 4,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 5,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
    hashtags: [
      {
        htag_id: 1,
        htag_name: "지브리",
        htag_type: "none"
      }
    ]
  },
  {
    id: 6,
    title: "샌과 치히로의 행방불명 장소",
    description:
      "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
    status: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    categoryName: "관광지",
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

const tabDatas: Array<{ title: string; query: TuserSelection }> = [
  {
    title: "작성한 셀렉션",
    query: "my"
  },
  {
    title: "북마크 셀렉션",
    query: "bookmark"
  },
  {
    title: "임시저장 셀렉션",
    query: "temp"
  }
];

const UserSelectionList = () => {
  const [currentSelection, setCurrentSelection] = useState<TuserSelection>("my");

  const handleTabData = (tabData : TuserSelection) => {
    setCurrentSelection(tabData)
    deleteQueryString(QUERY_STRING_NAME.userSelection)
    addQueryString(QUERY_STRING_NAME.userSelection, tabData);
  }

  return (
    <div className="mt-10 h-auto m-auto">
      <ul className="list-none flex gap-[20px] text-large font-bold text-grey3 cursor-pointer mb-10">{
        tabDatas.map((tabData)=>(
          <li key={tabData.query} className={currentSelection === tabData.query ? 'text-black font-extrabold' : 'text-grey3'}
          onClick={()=>handleTabData(tabData.query)}
          >{tabData.title}</li>
        ))}

      </ul>
      <div className="grid grid-cols-3 mt-5 gap-[20px]">
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
      <div className="translate-x-[-90px]">
      <Pagination pagination={pagination}></Pagination>
      </div>
    </div>
  );
};

export default UserSelectionList;
