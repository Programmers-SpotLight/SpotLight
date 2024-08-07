import { Tab, Tabs } from "@/components/common/Tabs";
import React from "react";
import SpotHeader from "./spot-selection-contents/SpotHeader";
import SpotReview from "./spot-selection-contents/SpotReview";
import SpotInfo from "./spot-selection-contents/SpotInfo";
import { ISpotInfo, SpotCategory } from "@/models/spot";

interface ISpotSectionProps {
  isSelectionDrawerOpen: boolean;
  isSpotDrawerOpen: boolean;
  selectedSpotId: number | null;
  spotData: ISpotInfo;
}

const SpotSection = ({
  isSpotDrawerOpen,
  isSelectionDrawerOpen,
  spotData
}: ISpotSectionProps) => {
  const spotTab = [
    {
      title: "스팟 정보",
      component: <SpotInfo description={spotData.description} />
    },
    {
      title: "유저 리뷰",
      component: <SpotReview />
    }
  ];

  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen && isSpotDrawerOpen
          ? "translate-x-0"
          : isSelectionDrawerOpen
          ? "-translate-x-full"
          : "-translate-x-[200%]"
      }
      transition- ease-in-out duration-500
border-[0.5px] border-grey2 border-solid w-[375px] overflow-y-scroll scrollbar-hide`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      <SpotHeader
        images={spotData.images}
        categoryName={spotData.category.name as SpotCategory}
        title={spotData.title}
        address={spotData.address}
        hashtags={spotData.hashtags}
      />

      <div className="px-4">
        <hr className="my-5 text-grey0" />
        <Tabs>
          {spotTab.map((tab) => (
            <Tab key={tab.title} title={tab.title}>
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SpotSection;
