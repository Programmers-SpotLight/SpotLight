import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";

const temp: string[] = [
  "자동완서 예시",
  "동완성 예시",
  "완자탕면 에시",
  "성공은 별거아니다",
  "머리끝까지",
  "화가나네요",
  "생각보다 빨리 끝났으면",
  "생각보다 빨리 끝났으면",
  "생각보다 빨리 끝났으면",
  "생각보다 빨리 끝났으면"
];

interface IAutoCompletionProps {
  tagValue : string,
  setTagValue: React.Dispatch<React.SetStateAction<string>>;
}

const AutoCompletion: React.FC<IAutoCompletionProps> = ({ tagValue, setTagValue }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, temp.length - 1);
        scrollToIndex(newIndex);
        return newIndex;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        scrollToIndex(newIndex);
        return newIndex;
      });
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0) {
        setTagValue(temp[selectedIndex]);
      }
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    event.preventDefault();
    setSelectedIndex(index);
    setTagValue(temp[index]);
  };

  const scrollToIndex = (index: number) => {
    const listElement = document.getElementById("auto-complete-list");
    if (listElement) {
      const itemElement = listElement.children[index] as HTMLElement;
      if (itemElement) {
        listElement.scrollTop = itemElement.offsetTop - listElement.clientHeight / 2 + itemElement.clientHeight / 2;
      }
    }
  };

  return (
    <div
      className="flex absolute z-10 w-full bg-white border border-solid border-grey2 rounded-md mt-1 max-h-[300px] overflow-auto"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <ul id="auto-complete-list" className="flex-[0.6] p-5 pb-[15px] box-border max-h-[300px] overflow-auto">
        {temp.map((item, index) => (
          <li
            key={index}
            className={`flex p-2 text-grey4 gap-[10px] justify-between hover:bg-grey1 rounded-lg cursor-pointer ${
              selectedIndex === index ? "bg-grey1" : ""
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
            onMouseDown={(event) => handleMouseDown(event, index)}
          >
            <div className="flex gap-[10px] items-center">
              <IoAdd className="fill-grey4 w-[15px] h-[20px] text-grey4" />
              <h2 className="text-medium text-grey4">{item}</h2>
            </div>
            <MdNavigateNext className="text-[20px] text-grey4 font-bold items-center" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoCompletion;
