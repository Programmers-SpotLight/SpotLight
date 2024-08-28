import useSubmitSelectionCreateForm from "@/hooks/useSubmitSelectionCreateForm";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import React from "react";
import { useStore } from "zustand";


const SelectionCreateSubmit : React.FC = () => {
  const {
    id,
    isTemporary,
  } = useStore(useSelectionCreateStore);

  const {
    isSubmitting,
    prepareAndSubmitCompleteSelection,
    prepareAndSubmitTemporarySelection
  } = useSubmitSelectionCreateForm();

  const handleTempSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    prepareAndSubmitTemporarySelection();
  };

  const handleSelectionSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    prepareAndSubmitCompleteSelection();
  };

  // id가 없거나 임시저장일 경우에만 임시저장 버튼을 렌더링
  const presaveable = (!id || (id && isTemporary));

  return (
    <div className="flex justify-center gap-4 mt-8">
      {presaveable && (
      <button
        className="w-[160px] text-grey5 text-medium font-bold mt-8 rounded-[8px] w-[163px] h-[40px] text-center border border-grey3"
        onClick={handleTempSubmitClick}
        disabled={isSubmitting}
      >
        임시저장
      </button>
      )}
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