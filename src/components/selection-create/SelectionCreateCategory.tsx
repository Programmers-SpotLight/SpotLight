import React from 'react';
import DropdownMenu from './DropdownMenu';
import { ISelectionCategory } from '@/models/selection.model';

interface ISelectionCreateCategoryProps {
  category: ISelectionCategory | undefined;
  onCategoryChange: (categoryValue: string) => void;
  options: ISelectionCategory[];
}

const SelectionCreateCategory : React.FC<ISelectionCreateCategoryProps> = ({
  category,
  options,
  onCategoryChange
}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="category" className="w-1/4 text-medium font-bold">카테고리 설정</label>
        <DropdownMenu
          onChange={onCategoryChange}
          options={
            options.map((category: ISelectionCategory) => ({
              value: category.id,
              label: category.name
            }))
          }
          currentChoice={category?.name}
        />
      </div>
      <p className="text-grey4 text-small w-1/3">셀렉션을 구분할 수 있는 카테고리입니다</p>
    </div>
  )
};

export default SelectionCreateCategory;