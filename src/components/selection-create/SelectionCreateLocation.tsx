import React from "react";


interface ISelectionCreateLocationProps {
  children: React.ReactNode;
}

const SelectionCreateLocation : React.FC<ISelectionCreateLocationProps> = ({children}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="location" className="w-1/4 text-medium font-bold">지역 설정</label>
        {children}
      </div>
      <p className="text-grey4 text-small w-1/3">스팟들을 아우르는 지역을 선택해주세요</p>
    </div>
  )
};

export default SelectionCreateLocation;