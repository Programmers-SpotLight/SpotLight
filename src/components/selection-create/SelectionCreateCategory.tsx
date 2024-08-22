import React from 'react';
import { useSelectionCreateStore } from '@/stores/selectionCreateStore';
import { useStore } from 'zustand';
import { ISelectionCategory } from '@/models/selection.model';
import SingleDropdown from '../common/SingleDropdown';


interface SelectionCreateCategoryProps {
  selectionCategories: ISelectionCategory[];
}

const SelectionCreateCategory : React.FC<SelectionCreateCategoryProps> = ({
  selectionCategories
}) => {
  const { category, setCategory } = useStore(useSelectionCreateStore);

  const handleCategoryClick = (id: number | string, name: string) => {
    if (typeof id === 'string') {
      return setCategory(undefined);
    }
    setCategory({ 
      id, 
      name 
    });
  }

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center w-2/3">
        <label htmlFor="category" className="w-1/4 text-medium font-bold">카테고리 설정</label>
        <SingleDropdown
          title='카테고리'
          contents={selectionCategories}
          onClick={handleCategoryClick}
          initialValue={category?.name}
        />
      </div>
      <p className="text-grey4 text-small w-1/3 break-keep">셀렉션을 구분할 수 있는 카테고리입니다</p>
    </div>
  )
};

export default SelectionCreateCategory;