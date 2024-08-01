import React, { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import SpotSection from "./SpotSection";
import SelectionSection from "./SelectionSection";

const Drawer = () => {
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] =
    useState<boolean>(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState<boolean>(false);

  //selectedSpot type은 임의로 string|null로, selectedSpot은 SpotSection의 prop으로 전달
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  const toggleDrawer = () => {
    if (isSpotDrawerOpen) setIsSpotDrawerOpen((prev) => !prev);
    else if (!isSpotDrawerOpen) setIsSelectionDrawerOpen((prev) => !prev);
  };

  const spotClickHandler = () => {
    //setSelectedSpot()
    setIsSpotDrawerOpen(true);
  };

  return (
    <div className="fixed left-0 flex">
      {/**selection drawer */}
      <SelectionSection
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        spotClickHandler={spotClickHandler}
      />

      {/**spot drawer */}
      <SpotSection isSpotDrawerOpen={isSpotDrawerOpen} />

      {/**button */}
      <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
        <button
          className={`w-[24px] h-[50px] bg-grey0 border-t border-r border-b border-primary border-solid rounded-sm`}
          onClick={toggleDrawer}
        >
          <FaCaretRight
            className={`text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              isSelectionDrawerOpen ? "rotate-180" : "rotate-0"
            }`}
            size={30}
          />
        </button>
      </div>
    </div>
  );
};

export default Drawer;
