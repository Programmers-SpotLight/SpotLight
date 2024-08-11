import React from 'react';
import Dropdown from '../common/Dropdown';
import { useSelectionCreateStore } from '@/stores/selectionCreateStore';
import { useStore } from 'zustand';
import { ISelectionCategory } from '@/models/selection.model';


interface SelectionCreateCategoryProps {
  selectionCategories: ISelectionCategory[];
}

const SelectionCreateCategory : React.FC<SelectionCreateCategoryProps> = ({
  selectionCategories
}) => {
  const { setCategory } = useStore(useSelectionCreateStore);

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="category" className="w-1/4 text-medium font-bold">카테고리 설정</label>
        <Dropdown
          title='카테고리'
          contents={selectionCategories}
          setCategory={setCategory}
        />
      </div>
      <p className="text-grey4 text-small w-1/3 break-keep">셀렉션을 구분할 수 있는 카테고리입니다</p>
    </div>
  )
};

export default SelectionCreateCategory;