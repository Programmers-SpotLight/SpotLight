import React from "react";

interface AutoCompletionListProps {
    autoCompletionList : any,
    selectedIndex : number,
    setSelectedIndex : React.Dispatch<React.SetStateAction<number>>,
    handleMouseDown : (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => void,
    highlightMatch : (text: string, query: string) => string | (string | React.JSX.Element)[],
    tagValue: string | null,
    isRecommend? : boolean
}

const AutoCompletionList = (
    {autoCompletionList,
    selectedIndex,
    setSelectedIndex,
    handleMouseDown,
    highlightMatch,
    tagValue,
    isRecommend
    } : AutoCompletionListProps
) => {

  return (
      <ul
        id="auto-complete-list"
        className={`flex ${isRecommend ? 'flex-0.5 w-3/6' : 'w-full'} p-5 pb-[15px] box-border max-h-[300px] overflow-auto flex-col`}
        >
        <h1 className="text-medium font-bold p-2 text-primary">
          # 연관 태그
        </h1>
        {autoCompletionList.map((item: { htag_name: string }, index: number) => (
          <li
            key={index}
            className={`flex p-2 text-grey4 gap-[10px] justify-between hover:bg-grey1 rounded-lg cursor-pointer ${
              selectedIndex === index ? "bg-grey1" : ""
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
            onMouseDown={(event) => handleMouseDown(event, index)}
          >
            <div className="flex gap-[10px] items-center">
              <h2 className="text-medium text-grey4 flex">
                {highlightMatch(item.htag_name, tagValue || "")}
              </h2>
            </div>
          </li>
        ))}
      </ul>
  );
};

export default AutoCompletionList;
