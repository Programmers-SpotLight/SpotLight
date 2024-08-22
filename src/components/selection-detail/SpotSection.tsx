import { Tab, Tabs } from "@/components/common/Tabs";
import React, { useEffect, useState } from "react";
import SpotHeader from "./spot-selection-contents/SpotHeader";
import SpotInfo from "./spot-selection-contents/SpotInfo";
import Review from "./review/Review";
import { ISpotImage, ISpotInfo } from "@/models/spot.model";

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
  const [images, setImages] = useState<ISpotImage[]>(spotData.images || []);

  const getImages = async () => {
    const { Place } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;

    if (images.length > 0) return;

    const place = new Place({ id: spotData.gmapId });

    await place.fetchFields({ fields: ["photos"] });

    if (place.photos && place.photos.length) {
      const newImages = place.photos.slice(0, 3).map((photo, index) => ({
        url: photo.getURI(),
        order: index
      }));
      setImages(newImages);
    }
  };

  useEffect(() => {
    getImages();
  }, [spotData]);

  const spotIdHex = bufferDataToHexString(spotData.id);

  const spotTab = [
    {
      title: "스팟 정보",
      component: <SpotInfo description={spotData.description} />
    },
    {
      title: "유저 리뷰",
      component: <Review reviewType="spot" sltOrSpotId={spotIdHex} />
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
        images={images}
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
