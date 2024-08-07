import React, { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import SpotSection from "./SpotSection";
import SelectionSection from "./SelectionSection";
import { ISelectionDetail } from "@/models/selection";

interface IDrawerProps {
  selectionData: ISelectionDetail;
  isSelectionDrawerOpen: boolean;
  isSpotDrawerOpen: boolean;
  toggleDrawer: () => void;
  spotClickHandler: (spotId: string) => void;
  selectedSpotId: string | null;
}
const Drawer = ({
  selectionData,
  isSelectionDrawerOpen,
  isSpotDrawerOpen,
  spotClickHandler,
  toggleDrawer,
  selectedSpotId
}: IDrawerProps) => {
  return (
    <div className={`absolute left-0 top-0 flex z-10`}>
      {/**selection drawer */}
      <SelectionSection
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        spotClickHandler={spotClickHandler}
        selectionData={selectionData}
        selectedSpotId={selectedSpotId}
      />

      {/**spot drawer */}
      <SpotSection
        isSelectionDrawerOpen={isSelectionDrawerOpen}
        isSpotDrawerOpen={isSpotDrawerOpen}
        selectedSpotId={selectedSpotId}
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
