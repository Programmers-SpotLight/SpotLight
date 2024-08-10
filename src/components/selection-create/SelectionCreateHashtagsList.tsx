import React from "react";


interface ISelectionCreateHashtagsListProps {
  children: React.ReactNode;
}

const SelectionCreateHashtagsList : React.FC<ISelectionCreateHashtagsListProps> = ({ children }) => {
  return (
    <div className="text-small">
      <p className="text-grey4">해시태그는 총 8개까지 등록 가능합니다</p>
      <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
        {children}
      </div>
    </div>
  );
};

export default SelectionCreateHashtagsList;