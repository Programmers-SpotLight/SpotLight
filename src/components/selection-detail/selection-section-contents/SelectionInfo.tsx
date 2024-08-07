import React from "react";

interface ISelectionInfoProps {
  description: string;
}

const SelectionInfo = ({ description }: ISelectionInfoProps) => {
  return (
    <div className="text-medium text-grey4 font-medium h-[450px] overflow-y-auto">
      {description}
    </div>
  );
};

export default SelectionInfo;
