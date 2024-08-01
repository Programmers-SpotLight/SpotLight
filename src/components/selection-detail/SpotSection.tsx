import React from "react";

interface ISpotSectionProps {
  isSpotDrawerOpen: boolean;
}

const SpotSection = ({ isSpotDrawerOpen }: ISpotSectionProps) => {
  console.log(isSpotDrawerOpen);
  return (
    <div
      className={`bg-white ${
        isSpotDrawerOpen ? "w-[375px]" : "w-0"
      } transition-all ease-in-out duration-500
         border-[0.5px] border-grey2 border-solid overflow-hidden`}
      style={{ height: "calc(100vh - 74px)" }}
    ></div>
  );
};

export default SpotSection;
