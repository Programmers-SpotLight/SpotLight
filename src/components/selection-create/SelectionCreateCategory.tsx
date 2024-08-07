import React from 'react';

interface ISelectionCreateCategoryProps {
  children: React.ReactNode;
}

const SelectionCreateCategory : React.FC<ISelectionCreateCategoryProps> = ({children}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="category" className="w-1/4 text-medium font-bold">카테고리 설정</label>
        {children}
      </div>
      <p className="text-grey4 text-small w-1/3">셀렉션을 구분할 수 있는 카테고리입니다</p>
    </div>
  )
};

export default SelectionCreateCategory;