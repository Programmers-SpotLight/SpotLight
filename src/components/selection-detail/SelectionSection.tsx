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
        isSelectionDrawerOpen ? "w-[375px]" : "w-0"
      } transition-all ease-in-out duration-500
   border-[0.5px] border-grey2 border-solid overflow-hidden`}
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
