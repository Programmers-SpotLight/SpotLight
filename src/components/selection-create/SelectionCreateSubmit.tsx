import React from "react";


interface ISelectionCreateSubmitProps {
  onTempSubmitClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectionSubmitClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SelectionCreateSubmit : React.FC<ISelectionCreateSubmitProps> = ({
  onTempSubmitClick,
  onSelectionSubmitClick
}) => {
  return(
    <div className="flex justify-center gap-4 mt-8">
      <button
        className="w-[160px] text-center py-2 border border-solid border-grey2 bg-white text-medium font-medium hover:bg-grey1 hover:border-grey3"
        onClick={onTempSubmitClick}
      >
        임시저장
      </button>
      <button
        className="w-[160px] text-center py-2 bg-primary text-white text-medium font-medium"
        onClick={onSelectionSubmitClick}
      >
        제출
      </button>
    </div>
  )
};

export default SelectionCreateSubmit;