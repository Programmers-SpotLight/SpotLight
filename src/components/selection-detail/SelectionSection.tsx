import React from "react";
import { Tab, Tabs } from "../common/Tabs";
import SelectionInfo from "./selection-section-contents/SelectionInfo";
import SelectionReview from "./selection-section-contents/SelectionReview";
import SpotList from "./selection-section-contents/SpotList";

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

const tempData = {
  temp_title: "슬램덩크 무대 탐방 공유합니다!",
  temp_category: "애니메이션",
  temp_hashtags: [
    "슬램덩크",
    "슬램덩크 무대탐방",
    "당일치기",
    "도쿄",
    "북산고",
    "정대만"
  ],
  temp_img:
    "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791169794930.jpg",
  temp_writer_img:
    "https://cdn.univ20.com/wp-content/uploads/2015/09/6dc71e74e42f102d4c361f570eaec985.jpg",
  temp_writer: "이창우"
};

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
      <img
        src={tempData.temp_img}
        className="w-full h-[218px] object-cover border border-grey2"
        alt="SelectionImg"
      />
      <div className="p-5 box-border">
        <div className="relative flex flex-col gap-[5px]">
          <h2 className="text-small text-grey4 font-medium">
            {tempData.temp_category}
          </h2>
          <h1 className="text-large text-black font-bold">
            {tempData.temp_title}
          </h1>
          <div className="flex gap-[5px] overflow-x-visible mt-[5px] mb-[15px]">
            {tempData.temp_hashtags.map((hashtag, index) => (
              <div
                key={index}
                className="p-2 bg-white border border-solid border-grey3 rounded-3xl text-extraSmall text-grey3 flex justify-center items-center whitespace-nowrap
                font-medium"
              >
                {hashtag}
              </div>
            ))}
          </div>
        </div>
        <Tabs>
          {selectionTabData(spotClickHandler).map((tab, index) => (
            <Tab key={index} title={tab.title}>
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SelectionSection;
