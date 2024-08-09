import useFetchSelectionCategories from '@/hooks/queries/useFetchSelectionCategories';
import React, { Dispatch, SetStateAction } from 'react';
import SearchDropdown from '../search/search-contents/SearchDropdown';
import { ISelectionCategory } from '@/models/selection.model';

interface ISelectionCreateCategoryProps {
  setCategory : Dispatch<SetStateAction<ISelectionCategory | undefined>>
}

const SelectionCreateCategory = ({setCategory
} : ISelectionCreateCategoryProps) => {
  const {
    data: categoryDatas,
    isError: categoryError,
    isLoading: categoryLoading
  } = useFetchSelectionCategories();

  if(!categoryDatas) return null

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="category" className="w-1/4 text-medium font-bold">카테고리 설정</label>
        <SearchDropdown
      title='카테고리'
      contents={categoryDatas}
      setCategory={setCategory}
      />
      </div>
      <p className="text-grey4 text-small w-1/3">셀렉션을 구분할 수 있는 카테고리입니다</p>
    </div>
  )
};

export default SelectionCreateCategory;