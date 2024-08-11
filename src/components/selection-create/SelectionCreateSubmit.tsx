import useSubmitSelectionCreateForm from "@/hooks/useSubmitSelectionCreateForm";
import React from "react";


const SelectionCreateSubmit : React.FC = () => {
  const {
    isSubmitting,
    submitCompleteSelection,
    submitTemporarySelection,
  } = useSubmitSelectionCreateForm();

  const handleTempSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitTemporarySelection();
  };

  const handleSelectionSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitCompleteSelection();
  };

  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        className="w-[160px] text-grey5 text-medium font-bold mt-8 rounded-[8px] w-[163px] h-[40px] text-center border border-grey3"
        onClick={handleTempSubmitClick}
        disabled={isSubmitting}
      >
        임시저장
      </button>
      <button
        className="bg-primary text-white text-medium font-bold mt-8 rounded-[8px] w-[163px] h-[40px] text-center"
        onClick={handleSelectionSubmitClick}
        disabled={isSubmitting}
      >
        제출
      </button>
    </div>
  )
};

export default SelectionCreateSubmit;