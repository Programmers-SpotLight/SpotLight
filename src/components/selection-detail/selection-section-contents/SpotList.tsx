import React from "react";

interface SpotListProps {
  spotClickHandler: () => void;
}

const SpotList = ({ spotClickHandler }: SpotListProps) => {
  return (
    <ul onClick={spotClickHandler} className="cursor-pointer">
      <li>spot1</li>
      <li>spot2</li>
    </ul>
  );
};

export default SpotList;
