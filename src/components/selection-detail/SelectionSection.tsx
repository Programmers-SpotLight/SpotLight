import React from "react";
import { Tab, Tabs } from "../common/Tabs";
import SelectionReview from "./review/selection-review/SelectionReview";
import SelectionInfo from "./selection-section-contents/SelectionInfo";
import SpotList from "./selection-section-contents/SpotList";
import SelectionHeader from "./selection-section-contents/SelectionHeader";
import { ISelectionDetail } from "@/models/selection";

interface ISelectionSectionProps {
  isSelectionDrawerOpen: boolean;
  spotClickHandler: (spotId: string) => void;
  selectionData: ISelectionDetail;
  selectedSpotId: string | null;
}

const SelectionSection = ({
  isSelectionDrawerOpen,
  spotClickHandler,
  selectionData,
  selectedSpotId
}: ISelectionSectionProps) => {
  const selectionTabData = (spotClickHandler: (spotId: string) => void) => [
    {
      title: "셀렉션 정보",
      component: <SelectionInfo description={selectionData.description} />
    },
    {
      title: "스팟 리스트",
      component: (
        <SpotList
          spotClickHandler={spotClickHandler}
          spotList={selectionData.spot_list}
          selectedSpotId={selectedSpotId}
        />
      )
    },
    {
      title: "유저 리뷰",
      component: <SelectionReview sltOrSpotId={1} />
    }
  ];

  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } transition ease-in-out duration-500 border-[0.5px] border-grey2 border-solid overflow-y-scroll scrollbar-hide w-[375px] z-10`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      <SelectionHeader selectionData={selectionData} />
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
