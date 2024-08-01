import React, { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import SpotSection from "./SpotSection";
import SelectionSection from "./SelectionSection";

const Drawer = () => {
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] =
    useState<boolean>(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    if (isSpotDrawerOpen) setIsSpotDrawerOpen((prev) => !prev);
    else if (!isSpotDrawerOpen) setIsSelectionDrawerOpen((prev) => !prev);
  };

  const spotClickHandler = () => {
    setIsSpotDrawerOpen(true);
  };

  return (
    <div className={`fixed flex z-10`}>
      {/**selection drawer */}
      <SelectionSection
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        spotClickHandler={spotClickHandler}
      />

      {/**spot drawer */}
      <SpotSection
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        isSpotDrawerOpen={isSpotDrawerOpen}
      />

      {/**button */}
      <div
        className={`absolute top-1/2 ${
          isSelectionDrawerOpen && isSpotDrawerOpen
            ? "left-[750px]"
            : isSelectionDrawerOpen
            ? "left-[375px]"
            : "left-0"
        } transform -translate-y-1/2 transition-all ease-in-out duration-500`}
      >
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
