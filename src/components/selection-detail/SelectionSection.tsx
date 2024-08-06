import React from "react";
import { Tab, Tabs } from "../common/Tabs";
import SelectionInfo from "./selection-section-contents/SelectionInfo";
import SelectionReview from "./selection-section-contents/SelectionReview";
import SpotList from "./selection-section-contents/SpotList";
import SelectionHeader from "./selection-section-contents/SelectionHeader";
import { ISelectionDetail } from "@/models/selection.model";

interface ISelectionSection {
  isSelectionDrawerOpen: boolean;
  spotClickHandler: () => void;
}

const selectionTabData = (spotClickHandler: () => void) => [
  {
    title: "셀렉션 정보",
    component: <SelectionInfo />
  },
  {
    title: "스팟 리스트",
    component: <SpotList spotClickHandler={spotClickHandler} />
  },
  {
    title: "유저 리뷰",
    component: <SelectionReview />
  }
];

const TempFetchData : ISelectionDetail = { // UI 스타일용 임시 데이터입니다. 수정하시면 될 것 같습니다.
  title : "슬램덩크 무대 탐방 공유합니다!",
  description : "애니메이션",
  category : {
    id : 1,
    name : "애니메이션"
  },
  user : {
    id : 1,
    nickname : '이창우',
    image : "https://ilyo.co.kr/contents/article/images/2023/1102/1698901514791536.jpg"
  },
  location : {
    is_world : true,
    region : "아시아"
  },
  image : "https://i.namu.wiki/i/O0u4__0DlY6tc9-S505SLruRy-q4ZOJ44-SHzBhGNsHVsUfnx5wE5mOB0XMCY6hloGXzRrfF7WXuu2nmGUNQhA.webp",
  hashtag : [
    "슬램덩크",
    "슬램덩크 무대탐방",
    "당일치기",
    "도쿄",
    "북산고",
    "정대만"
  ],
  status : null
}

const SelectionSection = ({
  isSelectionDrawerOpen,
  spotClickHandler
}: ISelectionSection) => {
  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } transition ease-in-out duration-500 border-[0.5px] border-grey2 border-solid overflow-hidden w-[375px] z-10`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      <SelectionHeader selectionDetailData={TempFetchData}/>
      <div className="pl-5 pr-5">
        <Tabs>
          {selectionTabData(spotClickHandler).map((tab) => (
            <Tab key={tab.title} title={tab.title}>
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SelectionSection;
