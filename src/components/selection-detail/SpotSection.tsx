import { Tab, Tabs } from "@/components/common/Tabs";
import React from "react";
import SpotHeader from "./spot-selection-contents/SpotHeader";
import SpotInfo from "./spot-selection-contents/SpotInfo";
import Review from "./review/Review";
import { ISpotInfo } from "@/models/spot.model";
import { SortProvider } from "@/context/useReviewSortContext";

interface ISpotSectionProps {
  isSelectionDrawerOpen: boolean;
  isSpotDrawerOpen: boolean;
  selectedSpotId: Buffer;
  spotData: ISpotInfo;
}

const bufferDataToHexString = (bufferObj: Buffer): string => {
  return Buffer.from(bufferObj).toString("hex");
};

const SpotSection = ({
  isSpotDrawerOpen,
  isSelectionDrawerOpen,
  spotData
}: ISpotSectionProps) => {
  const spotIdHex = bufferDataToHexString(spotData.id);

  const spotTab = [
    {
      title: "스팟 정보",
      component: <SpotInfo description={spotData.description} />
    },
    {
      title: "스팟 리뷰",
      component: (
        <SortProvider>
          <Review reviewType="spot" sltOrSpotId={spotIdHex} />
        </SortProvider>
      )
    }
  ];

  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen && isSpotDrawerOpen
          ? "translate-x-[750px]"
          : isSelectionDrawerOpen
          ? "translate-x-[375px]"
          : "translate-x-0"
      }
      transition- ease-in-out duration-500
border-[0.5px] border-grey2 border-solid w-[375px] overflow-y-scroll scrollbar-hide`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      <SpotHeader
        images={spotData.images}
        categoryName={spotData.categoryName}
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
