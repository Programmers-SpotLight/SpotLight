import React, { useState, useEffect, useRef } from "react";
import { IoAdd } from "react-icons/io5";
import useFetchSearchAutoCompletion from "@/hooks/queries/useFetchSearchAutoCompletion";
import useClickOutside from "@/hooks/useClickOutside";

interface IAutoCompletionProps {
  tagValue: string | null;
  setTagValue: React.Dispatch<React.SetStateAction<string>>;
  setVisibleAutoCompletion: React.Dispatch<React.SetStateAction<boolean>>;
  tagACRef: React.RefObject<HTMLDivElement>;
  tagInputRef: React.RefObject<HTMLInputElement>;
}

const AutoCompletion: React.FC<IAutoCompletionProps> = ({
  tagValue,
  setTagValue,
  setVisibleAutoCompletion,
  tagACRef,
  tagInputRef,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [cachedResults, setCachedResults] = useState<any[]>([]);
  const { data: apiResults, isError, isLoading } = useFetchSearchAutoCompletion(tagValue);
  
  useClickOutside(tagACRef, () => {
    setVisibleAutoCompletion(false);
  });

  useEffect(() => {
    if (apiResults?.data.length > 0) {
      setCachedResults(apiResults.data);
    }
    if (tagValue?.length === 0) setCachedResults([]);
  }, [apiResults]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, (cachedResults.length || 0) - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0 && cachedResults.length > 0) {
        setTagValue(cachedResults[selectedIndex].htag_name);
        setVisibleAutoCompletion(false);
        if (tagInputRef.current) tagInputRef.current.focus();
      }
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    setSelectedIndex(index);
    setTagValue(cachedResults[index].htag_name);
    setVisibleAutoCompletion(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <div className="font-bold" key={index}>
          {part}
        </div>
      ) : (
        part
      )
    );
  };

  if (!cachedResults.length && !tagValue) return null;

  return (
    <>
      {cachedResults.length > 0 && (
        <div
          className="flex absolute z-10 w-full bg-white border border-solid border-grey2 rounded-md mt-1 max-h-[300px] overflow-auto focus:border-primary"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={tagACRef}
        >
          <ul
            id="auto-complete-list"
            className="flex-[0.6] p-5 pb-[15px] box-border max-h-[300px] overflow-auto"
          >
            {cachedResults.map((item: { htag_name: string }, index: number) => (
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
                  <h2 className="text-medium text-grey4 flex">
                    {highlightMatch(item.htag_name, tagValue || "")}
                  </h2>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AutoCompletion;
