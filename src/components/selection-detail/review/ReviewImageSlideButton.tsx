import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ArrowProps {
  onClick: () => void;
  show: boolean;
}

export const PrevArrow: React.FC<ArrowProps> = ({ onClick, show }) => {
  if (!show) return null;
  return (
    <IoIosArrowBack
      className="w-[20px] h-[20px] absolute top-1/2 -left-[7px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center hover:bg-grey4 cursor-pointer"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

export const NextArrow: React.FC<ArrowProps> = ({ onClick, show }) => {
  if (!show) return null;
  return (
    <IoIosArrowForward
      className="w-[20px] h-[20px] absolute top-1/2 -right-[7px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center hover:bg-grey4 cursor-pointer"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};
