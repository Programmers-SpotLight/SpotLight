import React from "react";


interface ISelectionCreateDescriptionProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SelectionCreateDescription : React.FC<ISelectionCreateDescriptionProps> = ({
  description,
  onChange
}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="description" className="w-1/4 text-medium font-bold mt-3">셀렉션 설명</label>
        <textarea 
          className="border-solid h-[100px] border border-grey2 p-3 rounded-[8px] placeholder:font-medium w-3/4 resize-none" 
          placeholder="셀렉션 설명을 입력해주세요." 
          id="description" 
          name="description" 
          value={description}
          onChange={onChange}
        />
      </div>
      <p className="text-grey4 text-small w-1/3">셀렉션에서 사용자에게 설명될 내용입니다. 셀렉션를 통해 느꼈던 감정을 솔직하게 표현해주세요!</p>
    </div>
  )
};

export default SelectionCreateDescription;