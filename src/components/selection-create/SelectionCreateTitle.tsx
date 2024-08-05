import OneLineInput from "../common/input/OneLineInput";


interface ISelectionCreateTitleProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectionCreateTitle : React.FC<ISelectionCreateTitleProps> = ({
  title,
  onChange
}) => {
  return (
    <div className="flex items-center gap-6 pb-6">
      <div className="flex items-center grow">
        <label htmlFor="title" className="w-1/4 text-medium font-bold">셀렉션 제목</label>
        <OneLineInput
          placeholder="셀렉션 제목을 입력해주세요." 
          id="title" 
          name="title" 
          onChange={onChange}
          value={title}
          isError={false} 
          flexGrow={true}
        />
      </div>
      <p className="text-grey4 text-small w-1/3">셀렉션에서 사용자에게 표시될 내용입니다. 이목을 끌어주세요!</p>
    </div>
  )
}

export default SelectionCreateTitle;