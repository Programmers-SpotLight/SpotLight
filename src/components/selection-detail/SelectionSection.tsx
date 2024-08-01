import React from "react";
import { Tab, Tabs } from "../common/Tabs";
import SelectionInfo from "./selection-section-contents/SelectionInfo";
import SelectionReview from "./selection-section-contents/SelectionReview";
import SpotList from "./selection-section-contents/SpotList";
import SelectionHeader from "./selection-section-contents/SelectionHeader";

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
      <SelectionHeader />
      <div className="pl-5 pr-5">
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
