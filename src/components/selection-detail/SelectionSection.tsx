import React from "react";

interface ISelectionSection {
  isSelectionDrawerOpen: boolean;
  spotClickHandler: () => void;
}

const SelectionSection = ({
  isSelectionDrawerOpen,
  spotClickHandler
}: ISelectionSection) => {
  return (
    <div
      className={`bg-grey0 ${
        isSelectionDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } transition- ease-in-out duration-500
border-[0.5px] border-grey2 border-solid overflow-hidden w-[375px] z-10`}
      style={{ height: "calc(100vh - 74px)" }}
    >
      <ul onClick={spotClickHandler}>
        <li>spot1</li>
        <li>spot2</li>
      </ul>
    </div>
  );
};

export default SelectionSection;
